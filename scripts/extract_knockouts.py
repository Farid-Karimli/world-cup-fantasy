#!/usr/bin/env python3
"""Extract knockout-stage predictions from the 1/8-finals spreadsheet into submissions.json."""

from __future__ import annotations

import json
import sys
import zipfile
import xml.etree.ElementTree as ET
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
KNOCKOUTS_FILE = Path("/Users/faridkarimli/Downloads/1-8 final (WC 2026).xlsx")
FALLBACK_KNOCKOUTS_FILE = ROOT / "1-8 final (WC 2026).xlsx"
LEGACY_KNOCKOUTS_FILE = ROOT / "knockouts.xlsx"
OUTPUT_FILE = ROOT / "mobile" / "assets" / "submissions.json"
GROUP_OUTPUT = OUTPUT_FILE

# Keep in sync with extract_submissions.py
TEAM_MAP = {
    "Мексика": "Mexico",
    "ЮАР": "South Africa",
    "Южная Корея": "South Korea",
    "Чехия": "Czech Republic",
    "Канада": "Canada",
    "Бос.иГерц.": "Bosnia & Herzegovina",
    "Бос.и Герц.": "Bosnia & Herzegovina",
    "США": "USA",
    "Парагвай": "Paraguay",
    "Катар": "Qatar",
    "Швенйцария": "Switzerland",
    "Швейцария": "Switzerland",
    "Бразилия": "Brazil",
    "Марокко": "Morocco",
    "Гаити": "Haiti",
    "Шотландия": "Scotland",
    "Австралия": "Australia",
    "Турция": "Turkey",
    "Германия": "Germany",
    "Кюрасао": "Curaçao",
    "Нидерланды": "Netherlands",
    "Япония": "Japan",
    "Кот-д Ивуар": "Ivory Coast",
    "Кот-д'Ивуар": "Ivory Coast",
    "Эквадор": "Ecuador",
    "Тунис": "Tunisia",
    "Швеция": "Sweden",
    "Испания": "Spain",
    "Кабо Верде": "Cape Verde",
    "Кабо-Верде": "Cape Verde",
    "Бельгия": "Belgium",
    "Египет": "Egypt",
    "С.Аравия": "Saudi Arabia",
    "Уругвай": "Uruguay",
    "Иран": "Iran",
    "Нов.Зеландия": "New Zealand",
    "Франция": "France",
    "Сенегал": "Senegal",
    "Норвегия": "Norway",
    "Ирак": "Iraq",
    "Аргентина": "Argentina",
    "Алжир": "Algeria",
    "Австрия": "Austria",
    "Иордания": "Jordan",
    "Португалия": "Portugal",
    "ДР Конго": "DR Congo",
    "Англия": "England",
    "Хорватия": "Croatia",
    "Гана": "Ghana",
    "Панама": "Panama",
    "Узбекистан": "Uzbekistan",
    "Колумбия": "Colombia",
}

NS = {"m": "http://schemas.openxmlformats.org/spreadsheetml/2006/main"}
KNOCKOUT_START_ID = 100


def parse_match_name(name: str) -> tuple[str | None, str | None]:
    name = name.strip()
    for i, char in enumerate(name):
        if char != "-":
            continue
        left = name[:i].strip()
        right = name[i + 1 :].strip()
        team1 = TEAM_MAP.get(left)
        team2 = TEAM_MAP.get(right)
        if team1 and team2:
            return team1, team2
    return None, None


def read_xlsx_rows(path: Path) -> list[list[str | None]]:
    with zipfile.ZipFile(path) as archive:
        shared_root = ET.fromstring(archive.read("xl/sharedStrings.xml"))
        strings: list[str] = []
        for item in shared_root.findall("m:si", NS):
            parts: list[str] = []
            for text in item.iter("{http://schemas.openxmlformats.org/spreadsheetml/2006/main}t"):
                if text.text:
                    parts.append(text.text)
            strings.append("".join(parts))

        sheet = ET.fromstring(archive.read("xl/worksheets/sheet1.xml"))
        rows: list[list[str | None]] = []
        for row in sheet.findall(".//m:sheetData/m:row", NS):
            values: list[str | None] = []
            for cell in row.findall("m:c", NS):
                value = cell.find("m:v", NS)
                if value is None:
                    values.append(None)
                    continue
                if cell.get("t") == "s":
                    values.append(strings[int(value.text)])
                else:
                    values.append(value.text)
            rows.append(values)
        return rows


def extract_knockout_matches(rows: list[list[str | None]], stage: str = "round16") -> list[dict]:
    if not rows:
        return []

    header = rows[0]
    player_ids: list[int] = []
    for value in header[1:]:
        if value is None:
            continue
        try:
            player_ids.append(int(str(value).strip()))
        except ValueError:
            continue

    matches: list[dict] = []
    match_index = 0
    for row in rows[1:]:
        if not row or not row[0]:
            continue
        match_name = str(row[0]).strip()
        if match_name in {"ИГРЫ"}:
            continue
        team1, team2 = parse_match_name(match_name)
        if not team1 or not team2:
            # Stop once we hit the player-name footer rows.
            if any(name in match_name for name in ("Гусейнов", "Катибли", "M.V.A")):
                break
            continue

        predictions: dict[str, str] = {}
        for col, player_id in enumerate(player_ids, start=1):
            if col >= len(row):
                continue
            score = row[col]
            if score:
                predictions[str(player_id)] = str(score).strip()

        matches.append(
            {
                "id": KNOCKOUT_START_ID + match_index,
                "nameRu": match_name,
                "team1": team1,
                "team2": team2,
                "stage": stage,
                "predictions": predictions,
            }
        )
        match_index += 1

    return matches


def resolve_source() -> Path:
    for candidate in (KNOCKOUTS_FILE, FALLBACK_KNOCKOUTS_FILE, LEGACY_KNOCKOUTS_FILE):
        if candidate.exists():
            return candidate
    return KNOCKOUTS_FILE


def main() -> int:
    source = resolve_source()
    if not source.exists():
        print(f"Missing knockouts file: {KNOCKOUTS_FILE}", file=sys.stderr)
        return 1
    if not GROUP_OUTPUT.exists():
        print(f"Missing base submissions file: {GROUP_OUTPUT}", file=sys.stderr)
        return 1

    rows = read_xlsx_rows(source)
    knockout_matches = extract_knockout_matches(rows)
    if not knockout_matches:
        print("No knockout matches extracted", file=sys.stderr)
        return 1

    unmapped = [match["nameRu"] for match in knockout_matches if not match["team1"] or not match["team2"]]
    if unmapped:
        print("Unmapped knockout matches:", unmapped, file=sys.stderr)
        return 1

    data = json.loads(GROUP_OUTPUT.read_text(encoding="utf-8"))
    group_matches = [match for match in data["matches"] if match.get("stage") == "group"]
    data["matches"] = group_matches + knockout_matches

    OUTPUT_FILE.write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding="utf-8")
    print(
        f"Loaded {source.name}: merged {len(knockout_matches)} knockout matches "
        f"with {len(group_matches)} group matches -> {OUTPUT_FILE}"
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

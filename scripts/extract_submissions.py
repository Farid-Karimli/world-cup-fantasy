#!/usr/bin/env python3
"""Extract fantasy submissions from submissions.numbers into JSON."""

from __future__ import annotations

import json
import sys
from pathlib import Path

from numbers_parser import Document

ROOT = Path(__file__).resolve().parents[1]
NUMBERS_FILE = ROOT / "submissions.numbers"
OUTPUT_FILE = ROOT / "mobile" / "assets" / "submissions.json"

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


def parse_match_name(name: str) -> tuple[str | None, str | None]:
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


def extract_players(table) -> dict[int, str]:
    """Player name table spans rows 75-83 in four columns: IDs 1-9, 10-18, 19-27, 28-35."""
    players: dict[int, str] = {}
    for row in range(75, 84):
        if table.cell(row, 1).value and table.cell(row, 0).value:
            players[int(table.cell(row, 1).value)] = str(table.cell(row, 0).value)
        if table.cell(row, 11).value and table.cell(row, 4).value:
            players[int(table.cell(row, 11).value)] = str(table.cell(row, 4).value)
        if table.cell(row, 19).value and table.cell(row, 13).value:
            players[int(table.cell(row, 19).value)] = str(table.cell(row, 13).value)
        if table.cell(row, 27).value and table.cell(row, 21).value:
            players[int(table.cell(row, 27).value)] = str(table.cell(row, 21).value)
    return players


def extract_matches(table) -> list[dict]:
    matches: list[dict] = []
    for row in range(1, 75):
        match_name = table.cell(row, 0).value
        if not match_name or not str(match_name).strip():
            continue
        match_name = str(match_name)
        team1, team2 = parse_match_name(match_name)
        predictions: dict[str, str] = {}
        for col in range(1, table.num_cols):
            header = table.cell(0, col).value
            if header is None:
                continue
            pid = int(header)
            score = table.cell(row, col).value
            if score:
                predictions[str(pid)] = str(score)
        matches.append(
            {
                "id": row,
                "nameRu": match_name,
                "team1": team1,
                "team2": team2,
                "stage": "group",
                "predictions": predictions,
            }
        )
    return matches


def main() -> int:
    if not NUMBERS_FILE.exists():
        print(f"Missing {NUMBERS_FILE}", file=sys.stderr)
        return 1

    doc = Document(str(NUMBERS_FILE))
    table = doc.sheets[0].tables[0]
    players = extract_players(table)
    matches = extract_matches(table)

    unmapped = [m["nameRu"] for m in matches if not m["team1"] or not m["team2"]]
    if unmapped:
        print("Unmapped matches:", unmapped, file=sys.stderr)
        return 1

    data = {
        "players": [
            {"id": pid, "name": players.get(pid, f"Игрок {pid}")} for pid in range(1, 36)
        ],
        "matches": matches,
        "rules": {
            "groupExact": 5,
            "knockoutExact": 6,
            "finalExact": 8,
            "winner": 3,
        },
    }

    OUTPUT_FILE.parent.mkdir(parents=True, exist_ok=True)
    OUTPUT_FILE.write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"Wrote {len(data['players'])} players, {len(data['matches'])} matches -> {OUTPUT_FILE}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

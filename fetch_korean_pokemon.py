#!/usr/bin/env python3
"""
Fetch Korean Pokemon names from PokeAPI for generations 1-9
"""
import requests
import json
import time
from collections import defaultdict

def fetch_pokemon_data(max_pokemon=1025):
    """Fetch Korean names for all Pokemon from PokeAPI"""
    pokemon_data = []

    print(f"Fetching Pokemon data from PokeAPI (1-{max_pokemon})...")

    for pokemon_id in range(1, max_pokemon + 1):
        try:
            url = f"https://pokeapi.co/api/v2/pokemon-species/{pokemon_id}/"
            response = requests.get(url, timeout=10)

            if response.status_code == 200:
                data = response.json()

                # Get Korean name
                korean_name = None
                for name_entry in data.get('names', []):
                    if name_entry.get('language', {}).get('name') == 'ko':
                        korean_name = name_entry.get('name')
                        break

                if korean_name:
                    pokemon_data.append({
                        'id': pokemon_id,
                        'korean_name': korean_name,
                        'generation': data.get('generation', {}).get('name', '').replace('generation-', ''),
                        'english_name': data.get('name', '')
                    })

                    if pokemon_id % 50 == 0:
                        print(f"  Fetched {pokemon_id} Pokemon...")
            elif response.status_code == 404:
                print(f"  Pokemon {pokemon_id} not found (end of data)")
                break
            else:
                print(f"  Error fetching Pokemon {pokemon_id}: {response.status_code}")

            # Rate limiting
            time.sleep(0.1)

        except Exception as e:
            print(f"  Error fetching Pokemon {pokemon_id}: {e}")
            continue

    return pokemon_data

def save_data(pokemon_data, filename='korean_pokemon_names.json'):
    """Save Pokemon data to JSON file"""
    with open(filename, 'w', encoding='utf-8') as f:
        json.dump(pokemon_data, f, ensure_ascii=False, indent=2)
    print(f"\nSaved {len(pokemon_data)} Pokemon to {filename}")

if __name__ == "__main__":
    # Fetch data
    pokemon_data = fetch_pokemon_data()

    # Save to file
    save_data(pokemon_data, '/home/user/poke-word-chain/korean_pokemon_names.json')

    # Print summary
    generations = defaultdict(int)
    for p in pokemon_data:
        generations[p['generation']] += 1

    print("\n=== Summary ===")
    print(f"Total Pokemon: {len(pokemon_data)}")
    print("\nBy Generation:")
    for gen in sorted(generations.keys(), key=lambda x: int(x) if x.isdigit() else 0):
        print(f"  Generation {gen}: {generations[gen]} Pokemon")

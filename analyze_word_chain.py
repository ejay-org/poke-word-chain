#!/usr/bin/env python3
"""
Analyze Korean Pokemon word chain (끝말잇기) possibilities
"""
import csv
import json
from collections import defaultdict, deque
from typing import Dict, List, Set, Tuple

class PokemonWordChainAnalyzer:
    def __init__(self):
        self.pokemon_data = []
        self.dueum_rules = {
            '리': '이', '라': '나', '르': '으', '뢰': '뇌',
            '료': '요', '류': '유', '녀': '여', '뇨': '요',
            '뉴': '유', '니': '이'
        }
        self.graph = defaultdict(list)  # ending char -> list of pokemon
        self.reverse_graph = defaultdict(list)  # starting char -> list of pokemon

    def apply_dueum_rule(self, char: str) -> str:
        """Apply 두음법칙 (Korean initial sound law) to a character"""
        return self.dueum_rules.get(char, char)

    def get_first_char(self, name: str) -> str:
        """Get the first character of a Pokemon name, applying 두음법칙"""
        if not name:
            return ''
        first = name[0]
        return self.apply_dueum_rule(first)

    def get_last_char(self, name: str) -> str:
        """Get the last character of a Pokemon name"""
        return name[-1] if name else ''

    def load_pokemon_data(self, species_file='pokemon_species.csv',
                         names_file='pokemon_species_names.csv'):
        """Load Pokemon data from CSV files"""
        print("Loading Pokemon data...")

        # Load generation info
        species_data = {}
        with open(species_file, 'r', encoding='utf-8') as f:
            reader = csv.DictReader(f)
            for row in reader:
                species_data[int(row['id'])] = {
                    'generation': int(row['generation_id']),
                    'identifier': row['identifier']
                }

        # Load Korean names
        with open(names_file, 'r', encoding='utf-8') as f:
            reader = csv.DictReader(f)
            for row in reader:
                # language_id 3 is Korean
                if row['local_language_id'] == '3':
                    species_id = int(row['pokemon_species_id'])
                    korean_name = row['name']

                    if species_id in species_data:
                        self.pokemon_data.append({
                            'id': species_id,
                            'korean_name': korean_name,
                            'generation': species_data[species_id]['generation'],
                            'identifier': species_data[species_id]['identifier'],
                            'first_char': self.get_first_char(korean_name),
                            'last_char': self.get_last_char(korean_name)
                        })

        # Sort by ID
        self.pokemon_data.sort(key=lambda x: x['id'])

        print(f"Loaded {len(self.pokemon_data)} Pokemon with Korean names")

    def build_graph(self):
        """Build word chain graph"""
        print("\nBuilding word chain graph...")

        for pokemon in self.pokemon_data:
            last_char = pokemon['last_char']
            first_char = pokemon['first_char']

            # For each Pokemon, find which Pokemon can come next
            # (Pokemon whose first char matches this Pokemon's last char)
            self.graph[last_char].append(pokemon)
            self.reverse_graph[first_char].append(pokemon)

        print(f"Graph built with {len(self.graph)} ending characters")

    def find_next_pokemon(self, pokemon: Dict) -> List[Dict]:
        """Find all Pokemon that can follow the given Pokemon in word chain"""
        last_char = pokemon['last_char']
        # Apply 두음법칙 to the last character when it becomes a starting character
        normalized_char = self.apply_dueum_rule(last_char)
        return self.reverse_graph.get(normalized_char, [])

    def find_longest_chain_from(self, start_pokemon: Dict, max_depth=20) -> List[Dict]:
        """Find longest chain starting from a given Pokemon using greedy BFS"""
        from collections import deque

        best_chain = [start_pokemon]
        queue = deque([(start_pokemon, [start_pokemon], {start_pokemon['id']})])

        iterations = 0
        max_iterations = 1000

        while queue and iterations < max_iterations:
            iterations += 1
            current, chain, visited = queue.popleft()

            if len(chain) >= max_depth:
                if len(chain) > len(best_chain):
                    best_chain = chain
                continue

            if len(chain) > len(best_chain):
                best_chain = chain

            next_pokemon_list = self.find_next_pokemon(current)
            # Sort by number of outgoing connections (greedy)
            next_pokemon_list = sorted(next_pokemon_list,
                                      key=lambda p: len(self.find_next_pokemon(p)),
                                      reverse=True)

            for next_pokemon in next_pokemon_list[:3]:  # Only explore top 3
                if next_pokemon['id'] not in visited:
                    new_visited = visited.copy()
                    new_visited.add(next_pokemon['id'])
                    queue.append((next_pokemon, chain + [next_pokemon], new_visited))

        return best_chain

    def find_dead_ends(self) -> List[Dict]:
        """Find Pokemon that have no valid next word (dead ends)"""
        dead_ends = []
        for pokemon in self.pokemon_data:
            next_pokemon = self.find_next_pokemon(pokemon)
            # Dead end if no other Pokemon can follow (or only itself)
            valid_next = [p for p in next_pokemon if p['id'] != pokemon['id']]
            if not valid_next:
                dead_ends.append(pokemon)
        return dead_ends

    def find_cycles(self) -> List[List[Dict]]:
        """Find Pokemon that can form cycles"""
        cycles = []
        visited_global = set()

        for start_pokemon in self.pokemon_data:
            if start_pokemon['id'] in visited_global:
                continue

            visited_local = set()
            path = []

            def dfs(current: Dict) -> bool:
                if current['id'] in visited_local:
                    # Found a cycle
                    cycle_start_idx = next(i for i, p in enumerate(path) if p['id'] == current['id'])
                    cycle = path[cycle_start_idx:]
                    if len(cycle) > 1:  # Only count real cycles
                        cycles.append(cycle)
                    return True

                visited_local.add(current['id'])
                visited_global.add(current['id'])
                path.append(current)

                next_pokemon_list = self.find_next_pokemon(current)
                for next_pokemon in next_pokemon_list:
                    if next_pokemon['id'] != current['id']:  # Skip self-loops for now
                        dfs(next_pokemon)

                path.pop()
                return False

            dfs(start_pokemon)

        return cycles

    def analyze(self):
        """Perform comprehensive analysis"""
        print("\n" + "="*60)
        print("KOREAN POKEMON WORD CHAIN ANALYSIS")
        print("="*60)

        # Basic statistics
        print("\n### BASIC STATISTICS ###")
        print(f"Total Pokemon: {len(self.pokemon_data)}")

        # Count by generation
        gen_counts = defaultdict(int)
        for p in self.pokemon_data:
            gen_counts[p['generation']] += 1

        print("\nPokemon by Generation:")
        for gen in sorted(gen_counts.keys()):
            print(f"  Generation {gen}: {gen_counts[gen]} Pokemon")

        # Character analysis
        starting_chars = set(p['first_char'] for p in self.pokemon_data)
        ending_chars = set(p['last_char'] for p in self.pokemon_data)

        print(f"\nUnique starting characters: {len(starting_chars)}")
        print(f"Starting characters: {sorted(starting_chars)}")

        print(f"\nUnique ending characters: {len(ending_chars)}")
        print(f"Ending characters: {sorted(ending_chars)}")

        # Find characters that appear as endings but not as beginnings (problematic)
        problematic_endings = ending_chars - starting_chars
        print(f"\nProblematic ending characters (no Pokemon starts with these): {len(problematic_endings)}")
        if problematic_endings:
            print(f"  {sorted(problematic_endings)}")

        # Dead ends
        print("\n### DEAD-END POKEMON ###")
        dead_ends = self.find_dead_ends()
        print(f"Total dead-end Pokemon: {len(dead_ends)}")
        print("\nDead-end Pokemon (ending character -> Pokemon names):")
        dead_end_by_char = defaultdict(list)
        for p in dead_ends:
            dead_end_by_char[p['last_char']].append(p['korean_name'])

        for char in sorted(dead_end_by_char.keys()):
            names = dead_end_by_char[char]
            print(f"  {char}: {', '.join(names)} ({len(names)} Pokemon)")

        # Find longest chains
        print("\n### LONGEST CHAINS ###")
        print("Finding longest possible chains (this may take a while)...")

        # Sample a subset of Pokemon to test
        sample_size = min(30, len(self.pokemon_data))
        import random
        random.seed(42)
        sample_pokemon = random.sample(self.pokemon_data, sample_size)

        longest_overall = []
        longest_by_starter = {}

        for i, pokemon in enumerate(sample_pokemon):
            if i % 10 == 0:
                print(f"  Progress: {i}/{sample_size}...")

            chain = self.find_longest_chain_from(pokemon, max_depth=50)
            longest_by_starter[pokemon['korean_name']] = chain

            if len(chain) > len(longest_overall):
                longest_overall = chain

        print(f"\nLongest chain found: {len(longest_overall)} Pokemon")
        if longest_overall:
            print("Chain:")
            for i, p in enumerate(longest_overall[:20]):  # Show first 20
                print(f"  {i+1}. {p['korean_name']} (끝: {p['last_char']})")
            if len(longest_overall) > 20:
                print(f"  ... and {len(longest_overall) - 20} more")

        # Show top 10 best starting Pokemon
        print("\n### BEST STARTING POKEMON ###")
        sorted_starters = sorted(longest_by_starter.items(), key=lambda x: len(x[1]), reverse=True)
        print("Top 10 Pokemon for starting long chains:")
        for i, (name, chain) in enumerate(sorted_starters[:10]):
            print(f"  {i+1}. {name}: can chain {len(chain)} Pokemon")

        # Analyze connectivity
        print("\n### CONNECTIVITY ANALYSIS ###")
        start_char_counts = defaultdict(int)
        end_char_counts = defaultdict(int)
        for p in self.pokemon_data:
            start_char_counts[p['first_char']] += 1
            end_char_counts[p['last_char']] += 1

        print("\nMost common starting characters:")
        for char, count in sorted(start_char_counts.items(), key=lambda x: x[1], reverse=True)[:10]:
            print(f"  {char}: {count} Pokemon")

        print("\nMost common ending characters:")
        for char, count in sorted(end_char_counts.items(), key=lambda x: x[1], reverse=True)[:10]:
            print(f"  {char}: {count} Pokemon")

        # Self-chains
        print("\n### SELF-CHAINING POKEMON ###")
        self_chains = []
        for p in self.pokemon_data:
            if p['last_char'] == p['first_char'] or self.apply_dueum_rule(p['last_char']) == p['first_char']:
                self_chains.append(p)

        print(f"Pokemon that can chain to themselves: {len(self_chains)}")
        for p in self_chains[:10]:
            print(f"  {p['korean_name']} ({p['first_char']}...{p['last_char']})")

        # Export results
        results = {
            'total_pokemon': len(self.pokemon_data),
            'generations': dict(gen_counts),
            'starting_chars': sorted(starting_chars),
            'ending_chars': sorted(ending_chars),
            'problematic_endings': sorted(problematic_endings),
            'dead_end_count': len(dead_ends),
            'longest_chain_length': len(longest_overall),
            'longest_chain': [p['korean_name'] for p in longest_overall],
            'best_starters': [(name, len(chain)) for name, chain in sorted_starters[:20]],
            'self_chaining': [p['korean_name'] for p in self_chains]
        }

        with open('/home/user/poke-word-chain/analysis_results.json', 'w', encoding='utf-8') as f:
            json.dump(results, f, ensure_ascii=False, indent=2)

        print("\n" + "="*60)
        print("Analysis complete! Results saved to analysis_results.json")
        print("="*60)

        return results


def main():
    analyzer = PokemonWordChainAnalyzer()
    analyzer.load_pokemon_data()
    analyzer.build_graph()
    analyzer.analyze()


if __name__ == "__main__":
    main()

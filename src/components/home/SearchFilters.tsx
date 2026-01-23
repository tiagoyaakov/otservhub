"use client";

import { Search } from "lucide-react";

export interface FilterState {
  search: string;
  version: string;
  type: string;
  map: string;
  theme: string;
}

interface FilterOption {
  id: keyof Omit<FilterState, "search">;
  label: string;
  options: string[];
}

const filterGroups: FilterOption[] = [
  {
    id: "theme",
    label: "TEMA:",
    options: ["Todos", "Tibia", "Pokemon", "Naruto", "Dragonball", "Outros"],
  },
  {
    id: "version",
    label: "VERSÃO:",
    options: ["Todas", "7.4-8.0", "8.60", "12+"],
  },
  {
    id: "type",
    label: "TIPO:",
    options: ["Todos", "PvP", "Non-PvP", "War"],
  },
  {
    id: "map",
    label: "MAPA:",
    options: ["Todos", "Global", "Baiak", "Custom"],
  },
];

interface SearchFiltersProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
}

export function SearchFilters({ filters, onFilterChange }: SearchFiltersProps) {
  const handleSearchChange = (value: string) => {
    onFilterChange({ ...filters, search: value });
  };

  const handleFilterChange = (groupId: keyof Omit<FilterState, "search">, value: string) => {
    onFilterChange({ ...filters, [groupId]: value });
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-center gap-4">
        <div className="relative flex-shrink-0 lg:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Buscar servidor..."
            value={filters.search}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-center"
          />
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4 lg:gap-6">
          {filterGroups.map((group) => (
            <div key={group.id} className="flex items-center gap-2">
              <span className="text-xs text-gray-500 font-medium">{group.label}</span>
              <div className="flex gap-1">
                {group.options.map((option) => (
                  <button
                    key={option}
                    onClick={() => handleFilterChange(group.id, option)}
                    className={`px-3 py-1.5 text-xs rounded-md transition-colors ${filters[group.id] === option
                      ? "bg-purple-600 text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

import { create } from 'zustand'
import { projects } from '@/components/projects/projects-list'

const uniqueStatuses = ['all', ...new Set(projects.map((p) => p.status))]
const uniqueServices = ['all', ...new Set(projects.map((p) => p.service))]
const uniqueCountries = ['all', ...new Set(projects.map((p) => p.country))]
const uniqueYears = [
  'all',
  ...new Set(projects.map((p) => p.date.substring(0, 4))),
].sort((a, b) => Number(b) - Number(a))

const initialFilterState = {
  services: uniqueServices,
  dateMode: 'year',
  year: 'all',
  dateRange: { from: '', to: '' },
  searchTerm: '',
  country: 'all',
  city: 'all',
}

export const useFilterStore = create((set, get) => ({
  // --- RAW STATE ---
  activeFilters: initialFilterState,
  stagedFilters: initialFilterState,
  sortConfig: { key: 'date', direction: 'desc' },
  currentPage: 1,
  itemsPerPage: 12,
  isViewGrid: false,
  totalItems: 0,
  statusFilter: 'all',
  serviceFilter: 'all',
  countryFilter: 'all',
  cityFilter: 'all',
  dateRange: { from: '', to: '' },
  selectedServices: uniqueServices,
  dateFilterMode: 'year',
  selectedYear: 'all',

  // --- DERIVED VALUES ---
  get availableCities() {
    const countryFilter = get().countryFilter
    if (countryFilter === 'all') {
      return ['all', ...new Set(projects.map((p) => p.city))]
    }
    const citiesInCountry = projects
      .filter((p) => p.country === countryFilter)
      .map((p) => p.city)
    return ['all', ...new Set(citiesInCountry)]
  },

  get areAllServicesSelected() {
    return get().selectedServices.length === uniqueServices.length
  },

  get processedProjects() {
    const { activeFilters, sortConfig } = get()
    const filtered = projects.filter((project) => {
      const searchTerm = activeFilters.searchTerm.toLowerCase().trim()
      if (searchTerm) {
        const nameMatch = project.name.toLowerCase().includes(searchTerm)
        const titleMatch = project.title.toLowerCase().includes(searchTerm)
        if (!nameMatch && !titleMatch) return false
      }
      const countryMatch =
        activeFilters.country === 'all' ||
        project.country === activeFilters.country
      const cityMatch =
        activeFilters.city === 'all' || project.city === activeFilters.city
      const serviceMatch = activeFilters.services.includes(project.service)
      let dateMatch = true
      if (activeFilters.dateMode === 'year') {
        dateMatch =
          activeFilters.year === 'all' ||
          project.date.startsWith(activeFilters.year)
      } else {
        const projectYear = parseInt(project.date.substring(0, 4))
        const fromYear = activeFilters.dateRange.from
          ? parseInt(activeFilters.dateRange.from)
          : null
        const toYear = activeFilters.dateRange.to
          ? parseInt(activeFilters.dateRange.to)
          : null
        dateMatch =
          (!fromYear || projectYear >= fromYear) &&
          (!toYear || projectYear <= toYear)
      }
      return serviceMatch && dateMatch && countryMatch && cityMatch
    })

    return [...filtered].sort((a, b) => {
      let comparison = 0
      if (sortConfig.key === 'name') comparison = a.name.localeCompare(b.name)
      else comparison = new Date(a.date) - new Date(b.date)
      return sortConfig.direction === 'asc' ? comparison : -comparison
    })
  },

  get totalPages() {
    return Math.ceil(get().processedProjects.length / get().itemsPerPage)
  },

  get paginatedProjects() {
    const { currentPage, itemsPerPage } = get()
    const start = (currentPage - 1) * itemsPerPage
    return get().processedProjects.slice(start, start + itemsPerPage)
  },

  get availableFromYears() {
    const { dateRange } = get()
    if (!dateRange.to) return uniqueYears.filter((y) => y !== 'all')
    return uniqueYears.filter((y) => y === 'all' || y <= dateRange.to)
  },

  get availableToYears() {
    const { dateRange } = get()
    if (!dateRange.from) return uniqueYears.filter((y) => y !== 'all')
    return uniqueYears.filter((y) => y === 'all' || y >= dateRange.from)
  },

  get filtersEnabled() {
    const { activeFilters } = get()
    return {
      services: activeFilters.services.length < uniqueServices.length,
      date:
        activeFilters.dateMode === 'custom'
          ? activeFilters.dateRange.from || activeFilters.dateRange.to
          : activeFilters.year !== 'all',
      search: activeFilters.searchTerm.trim() !== '',
    }
  },

  // --- ACTIONS ---
  setActiveFilters: (filters) => set({ activeFilters: filters }),
  setStagedFilters: (filters) => set({ stagedFilters: filters }),
  setSortConfig: (config) => set({ sortConfig: config }),
  setCurrentPage: (page) => set({ currentPage: page }),
  setItemsPerPage: (count) => set({ itemsPerPage: count }),
  setIsViewGrid: (grid) => set({ isViewGrid: grid }),
  setStatusFilter: (value) => set({ statusFilter: value }),
  setServiceFilter: (value) => set({ serviceFilter: value }),
  setCountryFilter: (value) => set({ countryFilter: value, cityFilter: 'all' }),
  setCityFilter: (value) => set({ cityFilter: value }),
  setDateRange: (range) => set({ dateRange: range }),
  setSelectedServices: (arr) => set({ selectedServices: arr }),
  setDateFilterMode: (mode) => set({ dateFilterMode: mode }),
  setSelectedYear: (year) => set({ selectedYear: year }),

  handleDateRangeChange: (type, value) =>
    set((state) => ({
      dateRange: { ...state.dateRange, [type]: value === 'all' ? '' : value },
    })),

  handleApplyFilters: () =>
    set((state) => ({ activeFilters: state.stagedFilters, currentPage: 1 })),

  handleClearAllFilters: () =>
    set({
      activeFilters: initialFilterState,
      stagedFilters: initialFilterState,
      currentPage: 1,
    }),

  handleClearIndividualFilter: (filterKey) =>
    set((state) => {
      const newFilters = {
        ...state.activeFilters,
        [filterKey]: initialFilterState[filterKey],
      }
      return { activeFilters: newFilters, stagedFilters: newFilters, currentPage: 1 }
    }),
}))

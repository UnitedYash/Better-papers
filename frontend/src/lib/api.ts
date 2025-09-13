const API_BASE_URL = 'https://better-papers.onrender.com/'

export interface Paper {
  title: string
  authors: string[]
  summary: string
  published: string
  link: string
}

export interface CategoryResponse {
  category: string
  papers: Paper[]
}

export interface CategoriesResponse {
  categories: string[]
}

export const api = {
  async getCategories(): Promise<string[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/papers/categories`)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data: CategoriesResponse = await response.json()
      return data.categories
    } catch (error) {
      console.error('Failed to fetch categories:', error)
      throw error
    }
  },

  async getPapersByCategory(category: string): Promise<Paper[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/papers/${category}`)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data: CategoryResponse = await response.json()
      return data.papers
    } catch (error) {
      console.error(`Failed to fetch papers for category ${category}:`, error)
      throw error
    }
  }
}
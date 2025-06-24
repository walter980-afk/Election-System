// Mock data for development/demo purposes when Supabase is not configured

export const mockElections = [
  {
    id: "1",
    title: "Lubiri Secondary School Prefectorial Elections 2024",
    description: "Annual student leadership elections",
    start_date: "2024-01-01T00:00:00Z",
    end_date: "2024-12-31T23:59:59Z",
    is_active: true,
    created_at: "2024-01-01T00:00:00Z"
  }
]

export const mockPosts = [
  {
    id: "1",
    election_id: "1",
    title: "Head Boy",
    description: "Overall student leader for boys",
    category: "Senior Leadership",
    max_votes: 1,
    order_index: 1,
    created_at: "2024-01-01T00:00:00Z",
    candidates: [
      { id: "1", post_id: "1", name: "John Mukasa", gender: "Male", created_at: "2024-01-01T00:00:00Z" },
      { id: "2", post_id: "1", name: "David Ssemakula", gender: "Male", created_at: "2024-01-01T00:00:00Z" },
      { id: "3", post_id: "1", name: "Peter Kiwanuka", gender: "Male", created_at: "2024-01-01T00:00:00Z" }
    ]
  },
  {
    id: "2",
    election_id: "1",
    title: "Head Girl",
    description: "Overall student leader for girls",
    category: "Senior Leadership",
    max_votes: 1,
    order_index: 2,
    created_at: "2024-01-01T00:00:00Z",
    candidates: [
      { id: "4", post_id: "2", name: "Sarah Nakato", gender: "Female", created_at: "2024-01-01T00:00:00Z" },
      { id: "5", post_id: "2", name: "Grace Namukasa", gender: "Female", created_at: "2024-01-01T00:00:00Z" },
      { id: "6", post_id: "2", name: "Mary Nakirya", gender: "Female", created_at: "2024-01-01T00:00:00Z" }
    ]
  },
  {
    id: "3",
    election_id: "1",
    title: "Entertainment Prefect",
    description: "Organizes school entertainment activities",
    category: "Entertainment",
    max_votes: 1,
    order_index: 3,
    created_at: "2024-01-01T00:00:00Z",
    candidates: [
      { id: "7", post_id: "3", name: "James Okello", gender: "Male", created_at: "2024-01-01T00:00:00Z" },
      { id: "8", post_id: "3", name: "Alice Namusoke", gender: "Female", created_at: "2024-01-01T00:00:00Z" }
    ]
  },
  {
    id: "4",
    election_id: "1",
    title: "Sports Captain",
    description: "Leads school sports activities",
    category: "Games and Sports",
    max_votes: 1,
    order_index: 4,
    created_at: "2024-01-01T00:00:00Z",
    candidates: [
      { id: "9", post_id: "4", name: "Robert Muwanga", gender: "Male", created_at: "2024-01-01T00:00:00Z" },
      { id: "10", post_id: "4", name: "Patricia Nalwoga", gender: "Female", created_at: "2024-01-01T00:00:00Z" }
    ]
  }
]

export const mockVoters = [
  { id: "1", voter_id: "V001", name: "Student One", email: "student1@school.com", has_voted: false, voted_at: null, created_at: "2024-01-01T00:00:00Z" },
  { id: "2", voter_id: "V002", name: "Student Two", email: "student2@school.com", has_voted: false, voted_at: null, created_at: "2024-01-01T00:00:00Z" },
  { id: "3", voter_id: "V003", name: "Student Three", email: "student3@school.com", has_voted: false, voted_at: null, created_at: "2024-01-01T00:00:00Z" },
  { id: "4", voter_id: "V004", name: "Student Four", email: "student4@school.com", has_voted: false, voted_at: null, created_at: "2024-01-01T00:00:00Z" },
  { id: "5", voter_id: "V005", name: "Student Five", email: "student5@school.com", has_voted: false, voted_at: null, created_at: "2024-01-01T00:00:00Z" }
]

export const mockAdminUsers = [
  { id: "1", username: "admin", role: "super_admin", name: "System Administrator", created_at: "2024-01-01T00:00:00Z" },
  { id: "2", username: "headteacher", role: "headteacher", name: "Head Teacher", created_at: "2024-01-01T00:00:00Z" },
  { id: "3", username: "chairperson", role: "electoral_chairperson", name: "Electoral Chairperson", created_at: "2024-01-01T00:00:00Z" }
]

export const mockVotes: any[] = []

// Mock Supabase-like API
export const mockSupabaseAPI = {
  from: (table: string) => {
    const createQueryBuilder = () => {
      let currentData: any[] = []
      let currentError: any = null

      const queryBuilder = {
        select: (columns?: string) => {
          // Handle complex select with joins
          if (columns && columns.includes('candidates')) {
            switch (table) {
              case "posts":
                currentData = mockPosts.map(post => ({
                  ...post,
                  candidates: post.candidates
                }))
                break
            }
          } else {
            switch (table) {
              case "elections":
                currentData = mockElections
                break
              case "posts":
                currentData = mockPosts
                break
              case "voters":
                currentData = mockVoters
                break
              case "candidates":
                currentData = mockPosts.flatMap(p => p.candidates)
                break
              case "votes":
                currentData = mockVotes
                break
              case "admin_users":
                currentData = mockAdminUsers
                break
            }
          }
          return queryBuilder
        },
        eq: (column: string, value: any) => {
          currentData = currentData.filter(item => item[column] === value)
          return queryBuilder
        },
        order: (column: string) => {
          currentData = currentData.sort((a, b) => {
            if (column === "order_index") {
              return (a.order_index || 0) - (b.order_index || 0)
            }
            return 0
          })
          return queryBuilder
        },
        limit: (count: number) => {
          currentData = currentData.slice(0, count)
          return queryBuilder
        },
        single: () => {
          const item = currentData[0] || null
          if (!item) {
            currentError = new Error("Not found")
          }
          return Promise.resolve({ data: item, error: currentError })
        },
        then: (callback: any) => {
          return callback({ data: currentData, error: currentError })
        }
      }

      return queryBuilder
    }

    return {
      ...createQueryBuilder(),
      insert: (values: any) => ({
        then: (callback: any) => {
          if (table === "votes") {
            if (Array.isArray(values)) {
              values.forEach(vote => {
                mockVotes.push({
                  id: (mockVotes.length + 1).toString(),
                  ...vote,
                  created_at: new Date().toISOString()
                })
              })
            } else {
              mockVotes.push({
                id: (mockVotes.length + 1).toString(),
                ...values,
                created_at: new Date().toISOString()
              })
            }
          }
          return callback({ data: values, error: null })
        }
      }),
      update: (values: any) => ({
        eq: (column: string, value: any) => ({
          then: (callback: any) => {
            if (table === "voters") {
              const voterIndex = mockVoters.findIndex(v => v[column as keyof typeof v] === value)
              if (voterIndex !== -1) {
                mockVoters[voterIndex] = { ...mockVoters[voterIndex], ...values }
              }
            }
            return callback({ data: values, error: null })
          }
        })
      })
    }
  }
}
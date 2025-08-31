// Mock clinical insights database
const clinicalInsights = [
  {
    id: "1",
    title: "Understanding Eczema: Causes and Triggers",
    category: "Dermatitis",
    summary: "Comprehensive overview of eczema causes, common triggers, and management strategies.",
    content: "Eczema, also known as atopic dermatitis, is a chronic inflammatory skin condition affecting millions worldwide...",
    tags: ["eczema", "atopic dermatitis", "triggers", "management"],
    lastUpdated: "2024-01-15",
    readTime: "5 min",
    difficulty: "beginner"
  },
  {
    id: "2",
    title: "Acne Treatment: From Topical to Systemic Approaches",
    category: "Acne",
    summary: "Evidence-based treatment protocols for different types and severities of acne.",
    content: "Acne vulgaris is one of the most common dermatological conditions, affecting up to 85% of adolescents...",
    tags: ["acne", "treatment", "topical", "systemic", "retinoids"],
    lastUpdated: "2024-01-10",
    readTime: "8 min",
    difficulty: "intermediate"
  },
  {
    id: "3",
    title: "Psoriasis: Pathophysiology and Modern Therapies",
    category: "Autoimmune",
    summary: "Latest understanding of psoriasis mechanisms and breakthrough treatment options.",
    content: "Psoriasis is a chronic autoimmune condition characterized by accelerated keratinocyte proliferation...",
    tags: ["psoriasis", "autoimmune", "biologics", "pathophysiology"],
    lastUpdated: "2024-01-08",
    readTime: "12 min",
    difficulty: "advanced"
  },
  {
    id: "4",
    title: "Skin Cancer Detection: Early Warning Signs",
    category: "Oncology",
    summary: "Critical signs and symptoms for early detection of skin malignancies.",
    content: "Early detection of skin cancer significantly improves treatment outcomes and survival rates...",
    tags: ["skin cancer", "melanoma", "detection", "ABCDE", "prevention"],
    lastUpdated: "2024-01-12",
    readTime: "6 min",
    difficulty: "beginner"
  },
  {
    id: "5",
    title: "Pediatric Dermatology: Common Conditions in Children",
    category: "Pediatric",
    summary: "Overview of frequent skin conditions in pediatric patients and age-appropriate treatments.",
    content: "Children's skin differs significantly from adult skin in structure, function, and disease presentation...",
    tags: ["pediatric", "children", "skin conditions", "treatment"],
    lastUpdated: "2024-01-05",
    readTime: "10 min",
    difficulty: "intermediate"
  }
];

class InsightsService {
  getAllInsights(filters = {}) {
    const { 
      category, 
      difficulty, 
      tags, 
      search, 
      page = 1, 
      limit = 10 
    } = filters;

    let filteredInsights = [...clinicalInsights];

    // Apply filters
    if (category) {
      filteredInsights = filteredInsights.filter(insight => 
        insight.category.toLowerCase() === category.toLowerCase()
      );
    }

    if (difficulty) {
      filteredInsights = filteredInsights.filter(insight => 
        insight.difficulty === difficulty
      );
    }

    if (tags) {
      const tagArray = tags.split(',').map(tag => tag.trim().toLowerCase());
      filteredInsights = filteredInsights.filter(insight =>
        tagArray.some(tag => insight.tags.some(insightTag => 
          insightTag.toLowerCase().includes(tag)
        ))
      );
    }

    if (search) {
      const searchTerm = search.toLowerCase();
      filteredInsights = filteredInsights.filter(insight =>
        insight.title.toLowerCase().includes(searchTerm) ||
        insight.summary.toLowerCase().includes(searchTerm) ||
        insight.content.toLowerCase().includes(searchTerm) ||
        insight.tags.some(tag => tag.toLowerCase().includes(searchTerm))
      );
    }

    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + parseInt(limit);
    const paginatedInsights = filteredInsights.slice(startIndex, endIndex);

    return {
      insights: paginatedInsights,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(filteredInsights.length / limit),
        totalItems: filteredInsights.length,
        itemsPerPage: parseInt(limit)
      },
      filters: {
        categories: [...new Set(clinicalInsights.map(i => i.category))],
        difficulties: [...new Set(clinicalInsights.map(i => i.difficulty))],
        allTags: [...new Set(clinicalInsights.flatMap(i => i.tags))]
      }
    };
  }

  getInsightById(id) {
    const insight = clinicalInsights.find(insight => insight.id === id);
    
    if (!insight) {
      throw new Error('Insight not found');
    }

    // Mock full content for detailed view
    const detailedInsight = {
      ...insight,
      content: `
# ${insight.title}

## Overview
${insight.summary}

## Key Points
- Comprehensive understanding of the condition
- Evidence-based treatment approaches
- Latest research findings
- Clinical best practices

## Detailed Information
This section would contain the full clinical insight content, including:
- Pathophysiology
- Clinical presentation
- Diagnostic criteria
- Treatment protocols
- Patient management strategies
- Recent advances in the field

## References
1. Recent clinical studies and research papers
2. Professional dermatology guidelines
3. Peer-reviewed medical literature
4. Expert consensus statements

## Related Topics
- Related conditions and differential diagnoses
- Complementary treatment approaches
- Patient education resources
      `,
      relatedInsights: clinicalInsights
        .filter(related => related.id !== id && 
          (related.category === insight.category || 
           related.tags.some(tag => insight.tags.includes(tag))))
        .slice(0, 3)
        .map(related => ({
          id: related.id,
          title: related.title,
          category: related.category,
          readTime: related.readTime
        }))
    };

    return detailedInsight;
  }

  getInsightsByCategory(category) {
    const categoryInsights = clinicalInsights.filter(insight =>
      insight.category.toLowerCase() === category.toLowerCase()
    );

    if (categoryInsights.length === 0) {
      throw new Error('Category not found');
    }

    return {
      category,
      insights: categoryInsights,
      count: categoryInsights.length
    };
  }

  getTrendingInsights() {
    // Mock trending logic - in real app, this would be based on views, likes, etc.
    const trendingInsights = clinicalInsights
      .sort(() => Math.random() - 0.5) // Random for demo
      .slice(0, 5)
      .map(insight => ({
        ...insight,
        views: Math.floor(Math.random() * 1000) + 100,
        likes: Math.floor(Math.random() * 50) + 10
      }));

    return trendingInsights;
  }

  searchInsights(query, filters = {}) {
    if (!query || query.trim().length === 0) {
      throw new Error('Search query required');
    }

    const searchTerm = query.toLowerCase();
    let results = clinicalInsights.filter(insight =>
      insight.title.toLowerCase().includes(searchTerm) ||
      insight.summary.toLowerCase().includes(searchTerm) ||
      insight.content.toLowerCase().includes(searchTerm) ||
      insight.tags.some(tag => tag.toLowerCase().includes(searchTerm))
    );

    // Apply additional filters
    if (filters.category) {
      results = results.filter(insight => 
        insight.category.toLowerCase() === filters.category.toLowerCase()
      );
    }

    if (filters.difficulty) {
      results = results.filter(insight => insight.difficulty === filters.difficulty);
    }

    return {
      query,
      results,
      count: results.length
    };
  }
}

export default new InsightsService();
// Mock Elasticsearch service for Crime 360 application
export interface FIRDocument {
  id: string;
  firNumber: string;
  type: string;
  complainant: {
    name: string;
    age: number;
    address: string;
    phone: string;
  };
  accused: {
    name: string;
    age?: number;
    description: string;
    knownAliases?: string[];
  };
  status: 'Pending' | 'Under Investigation' | 'Resolved' | 'Closed';
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  date: string;
  location: {
    area: string;
    coordinates: {
      lat: number;
      lon: number;
    };
    address: string;
  };
  officer: string;
  description: string;
  evidence: string[];
  keywords: string[];
  timestamp: string;
}

export interface FaceRecognitionDocument {
  id: string;
  personId: string;
  name: string;
  aliases: string[];
  features: number[]; // Face encoding vector
  mugshots: string[];
  lastSeen: string;
  status: 'Wanted' | 'Convicted' | 'Released' | 'Under Investigation';
  charges: string[];
  locations: Array<{
    area: string;
    coordinates: { lat: number; lon: number };
    timestamp: string;
  }>;
  riskLevel: 'Low' | 'Medium' | 'High' | 'Critical';
  metadata: {
    height?: string;
    weight?: string;
    marks?: string[];
    tattoos?: string[];
  };
}

export interface SearchQuery {
  query?: string;
  filters?: {
    status?: string[];
    type?: string[];
    priority?: string[];
    dateRange?: {
      from: string;
      to: string;
    };
    location?: {
      center: { lat: number; lon: number };
      radius: string;
    };
  };
  sort?: Array<{
    field: string;
    order: 'asc' | 'desc';
  }>;
  size?: number;
  from?: number;
}

export interface SearchResponse<T> {
  hits: {
    total: number;
    hits: Array<{
      _id: string;
      _source: T;
      _score: number;
    }>;
  };
  aggregations?: any;
  took: number;
}

class ElasticsearchService {
  private firData: FIRDocument[] = [
    {
      id: '1',
      firNumber: 'FIR001234',
      type: 'Theft',
      complainant: {
        name: 'Rajesh Kumar',
        age: 35,
        address: 'Hebbal, bangalore',
        phone: '+91-9876543210'
      },
      accused: {
        name: 'Unknown suspect',
        description: 'Male, approximately 25-30 years, wearing dark clothes',
        knownAliases: []
      },
      status: 'Under Investigation',
      priority: 'Medium',
      date: '2025-01-08',
      location: {
        area: 'Malleshwaram',
        coordinates: { lat: 19.1367, lon: 72.8269 },
        address: 'Malleshwaram Market Area'
      },
      officer: 'Inspector Sharma',
      description: 'Mobile phone stolen from complainant while traveling in local train during rush hour',
      evidence: ['CCTV footage', 'Witness statements', 'Mobile phone IMEI'],
      keywords: ['mobile theft', 'train', 'rush hour', 'andheri'],
      timestamp: '2025-01-08T10:30:00Z'
    },
    {
      id: '2',
      firNumber: 'FIR001235',
      type: 'Vehicle Theft',
      complainant: {
        name: 'Priya Singh',
        age: 28,
        address: 'Belanduru, Bangalore',
        phone: '+91-9876543211'
      },
      accused: {
        name: 'Rahul Verma',
        description: 'Male, 32 years, suspicious behavior near parking area',
        knownAliases: ['Rahul V', 'RV']
      },
      status: 'Pending',
      priority: 'High',
      date: '2025-01-07',
      location: {
        area: 'Koramangala',
        coordinates: { lat: 19.0596, lon: 72.8403 },
        address: 'Shopping Mall Parking Lot'
      },
      officer: 'Sub-Inspector Patel',
      description: 'Honda Activa motorcycle stolen from shopping mall parking area, security guard noticed suspicious activity',
      evidence: ['Security footage', 'Parking ticket', 'Witness identification'],
      keywords: ['vehicle theft', 'motorcycle', 'honda activa', 'parking', 'mall'],
      timestamp: '2025-01-07T14:45:00Z'
    },
    {
      id: '3',
      firNumber: 'FIR001236',
      type: 'Fraud',
      complainant: {
        name: 'Amit Verma',
        age: 42,
        address: 'Hebbal, Bangalore',
        phone: '+91-9876543212'
      },
      accused: {
        name: 'Online Scammer',
        description: 'Operates fake e-commerce website, identity unknown',
        knownAliases: ['Tech Fraud Group']
      },
      status: 'Resolved',
      priority: 'Low',
      date: '2025-01-06',
      location: {
        area: 'MG Road',
        coordinates: { lat: 19.0179, lon: 72.8424 },
        address: 'Online transaction from home'
      },
      officer: 'Inspector Gupta',
      description: 'Online payment fraud through fake e-commerce website, amount of ₹15,000 debited without delivery',
      evidence: ['Bank statements', 'Website screenshots', 'Email communications', 'UPI transaction details'],
      keywords: ['online fraud', 'ecommerce', 'payment fraud', 'cyber crime'],
      timestamp: '2025-01-06T09:15:00Z'
    },
  
    {
      id: '1',
      firNumber: 'FIRB001234',
      type: 'Theft',
      complainant: {
        name: 'Anil Kumar',
        age: 35,
        address: 'Indiranagar, Bangalore',
        phone: '+91-9876543210'
      },
      accused: {
        name: 'Unknown suspect',
        description: 'Male, approximately 25-30 years, wearing dark clothes',
        knownAliases: []
      },
      status: 'Under Investigation',
      priority: 'Medium',
      date: '2025-01-08',
      location: {
        area: 'Indiranagar',
        coordinates: { lat: 12.9716, lon: 77.6413 },
        address: 'Near Indiranagar Metro Station'
      },
      officer: 'Inspector Ramesh',
      description: 'Wallet stolen from complainant near metro station',
      evidence: ['CCTV footage', 'Witness statements'],
      keywords: ['theft', 'wallet', 'indiranagar'],
      timestamp: '2025-01-08T10:30:00Z'
    },
    {
      id: '2',
      firNumber: 'FIRB001235',
      type: 'Vehicle Theft',
      complainant: {
        name: 'Priya Reddy',
        age: 28,
        address: 'Koramangala, Bangalore',
        phone: '+91-9876543211'
      },
      accused: {
        name: 'Rahul Sharma',
        description: 'Male, 32 years, suspicious behavior near parking area',
        knownAliases: ['Rahul S']
      },
      status: 'Pending',
      priority: 'High',
      date: '2025-01-07',
      location: {
        area: 'Koramangala',
        coordinates: { lat: 12.9352, lon: 77.6245 },
        address: 'Koramangala Shopping Complex Parking Lot'
      },
      officer: 'Sub-Inspector Patel',
      description: 'Two-wheeler (Hero Splendor) stolen from Koramangala parking area',
      evidence: ['Security footage', 'Parking ticket'],
      keywords: ['vehicle theft', 'two-wheeler', 'koramangala'],
      timestamp: '2025-01-07T14:45:00Z'
    },
    {
      id: '3',
      firNumber: 'FIRB001236',
      type: 'Fraud',
      complainant: {
        name: 'Amit Verma',
        age: 42,
        address: 'MG Road, Bangalore',
        phone: '+91-9876543212'
      },
      accused: {
        name: 'Online Scammer',
        description: 'Operates fake e-commerce website',
        knownAliases: ['Tech Fraud Bangalore']
      },
      status: 'Resolved',
      priority: 'Low',
      date: '2025-01-06',
      location: {
        area: 'MG Road',
        coordinates: { lat: 12.9718, lon: 77.5948 },
        address: 'Online transaction from home'
      },
      officer: 'Inspector Gupta',
      description: 'Online payment fraud, ₹20,000 debited without product delivery',
      evidence: ['Bank statements', 'Email communications'],
      keywords: ['online fraud', 'ecommerce', 'payment fraud'],
      timestamp: '2025-01-06T09:15:00Z'
    },
    {
      id: '4',
      firNumber: 'FIRB001237',
      type: 'Assault',
      complainant: {
        name: 'Sahana Nair',
        age: 29,
        address: 'Jayanagar, Bangalore',
        phone: '+91-9876543213'
      },
      accused: {
        name: 'Ravi Kumar',
        description: 'Male, aggressive behavior near park',
        knownAliases: []
      },
      status: 'Under Investigation',
      priority: 'High',
      date: '2025-01-09',
      location: {
        area: 'Jayanagar',
        coordinates: { lat: 12.9250, lon: 77.5938 },
        address: 'Near Jayanagar 4th Block Park'
      },
      officer: 'Inspector Mehta',
      description: 'Physical assault during evening walk near park',
      evidence: ['Witness statements', 'Medical reports'],
      keywords: ['assault', 'physical abuse', 'jayanagar'],
      timestamp: '2025-01-09T19:30:00Z'
    },
    {
      id: '5',
      firNumber: 'FIRB001238',
      type: 'Vandalism',
      complainant: {
        name: 'Rohit Shetty',
        age: 45,
        address: 'Whitefield, Bangalore',
        phone: '+91-9876543214'
      },
      accused: {
        name: 'Unknown suspects',
        description: 'Group of individuals vandalized property at night',
        knownAliases: []
      },
      status: 'Pending',
      priority: 'Medium',
      date: '2025-01-10',
      location: {
        area: 'Whitefield',
        coordinates: { lat: 12.9699, lon: 77.7500 },
        address: 'Whitefield Industrial Area'
      },
      officer: 'Sub-Inspector Rao',
      description: 'Multiple walls vandalized with spray paint',
      evidence: ['Photos of vandalism', 'Witness testimonies'],
      keywords: ['vandalism', 'property damage', 'whitefield'],
      timestamp: '2025-01-10T02:00:00Z'
    }
  ];

  // Add new face recognition data to the existing faceData array
  private faceData: FaceRecognitionDocument[] = [
    {
      id: 'face_1',
      personId: 'CR001',
      name: 'Saurav Singh',
      aliases: ['Saurav', 'SS'],
      features: [0.1, 0.2, 0.3, 0.4, 0.5], // Simplified face encoding
      mugshots: ['https://www.freepik.com/free-photo/middle-eastern-man-gray-turtleneck-black-face-protect-mask-isolated-background_26781498.htm#fromView=search&page=1&position=4&uuid=0d7943ad-eb8c-4ae5-869a-a2d657c3bc07&query=Ai+indian+theif+men'],
      lastSeen: '2025-01-05',
      status: 'Wanted',
      charges: ['Theft', 'Assault', 'Burglary'],
      locations: [
        {
          area: 'Jaynagar',
          coordinates: { lat: 19.1367, lon: 72.8269 },
          timestamp: '2025-01-05T16:20:00Z'
        }
      ],
      riskLevel: 'High',
      metadata: {
        height: '5\'8"',
        weight: '70kg',
        marks: ['Scar on left cheek'],
        tattoos: ['Dragon on right arm']
      }
    },
    {
      id: 'face_2',
      personId: 'CR002',
      name: 'Rajesh Kumar',
      aliases: ['Raj', 'RK'],
      features: [0.6, 0.7, 0.8, 0.9, 1.0],
      mugshots: ['https://as2.ftcdn.net/v2/jpg/07/34/14/73/1000_F_734147304_Hl8NP44J9mXiLXmwAoCmw7cFl2Zw61Yx.jpg'],
      lastSeen: '2024-12-20',
      status: 'Convicted',
      charges: ['Fraud', 'Money Laundering', 'Identity Theft'],
      locations: [
        {
          area: 'Cubbon Park',
          coordinates: { lat: 19.0596, lon: 72.8403 },
          timestamp: '2024-12-20T12:30:00Z'
        }
      ],
      riskLevel: 'Medium',
      metadata: {
        height: '6\'0"',
        weight: '80kg',
        marks: ['Mole on forehead'],
        tattoos: []
      }
    },
    // --- Bangalore Face Recognition Data ---
    {
      id: 'face_1',
      personId: 'CRB001',
      name: 'Saurav Nair',
      aliases: ['Saurav', 'SN'],
      features: [0.1, 0.2, 0.3, 0.4, 0.5],
      mugshots: ['https://example.com/mugshot1.jpg'],
      lastSeen: '2025-01-05',
      status: 'Wanted',
      charges: ['Theft', 'Assault'],
      locations: [
        { area: 'Jayanagar', coordinates: { lat: 12.9250, lon: 77.5938 }, timestamp: '2025-01-05T16:20:00Z' }
      ],
      riskLevel: 'High',
      metadata: { height: '5\'8"', weight: '70kg', marks: ['Scar on left cheek'], tattoos: ['Dragon on right arm'] }
    },
    {
      id: 'face_2',
      personId: 'CRB002',
      name: 'Rajesh Kumar',
      aliases: ['Raj', 'RK'],
      features: [0.6, 0.7, 0.8, 0.9, 1.0],
      mugshots: ['https://example.com/mugshot2.jpg'],
      lastSeen: '2024-12-20',
      status: 'Convicted',
      charges: ['Fraud'],
      locations: [
        { area: 'MG Road', coordinates: { lat: 12.9718, lon: 77.5948 }, timestamp: '2024-12-20T12:30:00Z' }
      ],
      riskLevel: 'Medium',
      metadata: { height: '6\'0"', weight: '80kg', marks: ['Mole on forehead'] }
    }
  ];

  // FIR Search with Elasticsearch-like capabilities
  async searchFIRs(query: SearchQuery): Promise<SearchResponse<FIRDocument>> {
    const startTime = Date.now();
    let results = [...this.firData];

    // Full-text search
    if (query.query) {
      const searchTerm = query.query.toLowerCase();
      results = results.filter(fir => 
        fir.firNumber.toLowerCase().includes(searchTerm) ||
        fir.complainant.name.toLowerCase().includes(searchTerm) ||
        fir.accused.name.toLowerCase().includes(searchTerm) ||
        fir.description.toLowerCase().includes(searchTerm) ||
        fir.location.area.toLowerCase().includes(searchTerm) ||
        fir.keywords.some(keyword => keyword.toLowerCase().includes(searchTerm))
      );
    }

    // Apply filters
    if (query.filters) {
      if (query.filters.status?.length) {
        results = results.filter(fir => query.filters!.status!.includes(fir.status));
      }
      if (query.filters.type?.length) {
        results = results.filter(fir => query.filters!.type!.includes(fir.type));
      }
      if (query.filters.priority?.length) {
        results = results.filter(fir => query.filters!.priority!.includes(fir.priority));
      }
      if (query.filters.dateRange) {
        const from = new Date(query.filters.dateRange.from);
        const to = new Date(query.filters.dateRange.to);
        results = results.filter(fir => {
          const firDate = new Date(fir.date);
          return firDate >= from && firDate <= to;
        });
      }
      if (query.filters.location) {
        // Geospatial search (simplified)
        const { center, radius } = query.filters.location;
        const radiusKm = parseFloat(radius.replace('km', ''));
        results = results.filter(fir => {
          const distance = this.calculateDistance(
            center.lat, center.lon,
            fir.location.coordinates.lat, fir.location.coordinates.lon
          );
          return distance <= radiusKm;
        });
      }
    }

    // Apply sorting
    if (query.sort?.length) {
      results.sort((a, b) => {
        for (const sortField of query.sort!) {
          let aValue = this.getNestedValue(a, sortField.field);
          let bValue = this.getNestedValue(b, sortField.field);
          
          if (aValue < bValue) return sortField.order === 'asc' ? -1 : 1;
          if (aValue > bValue) return sortField.order === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }

    // Pagination
    const from = query.from || 0;
    const size = query.size || 10;
    const paginatedResults = results.slice(from, from + size);

    const took = Date.now() - startTime;

    return {
      hits: {
        total: results.length,
        hits: paginatedResults.map((fir, index) => ({
          _id: fir.id,
          _source: fir,
          _score: 1.0 - (index * 0.1) // Mock relevance score
        }))
      },
      took
    };
  }

  // Face Recognition Search
  async searchFaces(features: number[], threshold: number = 0.8): Promise<SearchResponse<FaceRecognitionDocument>> {
    const startTime = Date.now();
    
    // Calculate similarity scores
    const results = this.faceData.map(face => {
      const similarity = this.calculateCosineSimilarity(features, face.features);
      return {
        face,
        similarity,
        score: similarity
      };
    })
    .filter(result => result.similarity >= threshold)
    .sort((a, b) => b.similarity - a.similarity);

    const took = Date.now() - startTime;

    return {
      hits: {
        total: results.length,
        hits: results.map(result => ({
          _id: result.face.id,
          _source: result.face,
          _score: result.score
        }))
      },
      took
    };
  }

  // Geospatial aggregations for crime heatmap
  async getCrimeHeatmapData(bounds?: { 
    topLeft: { lat: number; lon: number };
    bottomRight: { lat: number; lon: number };
  }): Promise<any> {
    let data = this.firData;
    
    if (bounds) {
      data = data.filter(fir => 
        fir.location.coordinates.lat <= bounds.topLeft.lat &&
        fir.location.coordinates.lat >= bounds.bottomRight.lat &&
        fir.location.coordinates.lon >= bounds.topLeft.lon &&
        fir.location.coordinates.lon <= bounds.bottomRight.lon
      );
    }

    // Group by location for heatmap
    const heatmapPoints = data.map(fir => ({
      lat: fir.location.coordinates.lat,
      lon: fir.location.coordinates.lon,
      weight: this.getPriorityWeight(fir.priority),
      type: fir.type,
      count: 1
    }));

    return {
      points: heatmapPoints,
      total: data.length,
      typeAggregation: this.aggregateByField(data, 'type'),
      priorityAggregation: this.aggregateByField(data, 'priority'),
      statusAggregation: this.aggregateByField(data, 'status')
    };
  }

  // Analytics aggregations
  // async getAnalytics(timeRange?: { from: string; to: string }): Promise<any> {
  //   let data = this.firData;

  //   if (timeRange) {
  //     const from = new Date(timeRange.from);
  //     const to = new Date(timeRange.to);
  //     data = data.filter(fir => {
  //       const firDate = new Date(fir.date);
  //       return firDate >= from && firDate <= to;
  //     });
  //   }

  //   return {
  //     totalCrimes: data.length,
  //     crimesByType: this.aggregateByField(data, 'type'),
  //     crimesByStatus: this.aggregateByField(data, 'status'),
  //     crimesByPriority: this.aggregateByField(data, 'priority'),
  //     crimesByLocation: this.aggregateByField(data, 'location.area'),
  //     timeSeriesData: this.getTimeSeriesData(data),
  //     topKeywords: this.getTopKeywords(data),
  //     averageResolutionTime: this.calculateAverageResolutionTime(data)
  //   };
  // }
  public async getAnalytics(query: { from: string; to: string }): Promise<any> {
  // Sample mock data structure
  return {
    totalCrimes: 128,
    averageResolutionTime: 5, // days
    crimesByType: [
      { key: 'Theft', doc_count: 45 },
      { key: 'Vehicle Crime', doc_count: 32 },
      { key: 'Assault', doc_count: 28 },
      { key: 'Fraud', doc_count: 15 },
      { key: 'Vandalism', doc_count: 8 }
    ],
    crimesByStatus: [
      { key: 'Under Investigation', doc_count: 50 },
      { key: 'Resolved', doc_count: 70 },
      { key: 'Pending', doc_count: 8 }
    ],
    crimesByPriority: [
      { key: 'High', doc_count: 40 },
      { key: 'Medium', doc_count: 60 },
      { key: 'Low', doc_count: 28 }
    ],
    timeSeriesData: [
      { date: '2025-01-01', count: 5 },
      { date: '2025-01-02', count: 10 },
      { date: '2025-01-03', count: 15 },
      { date: '2025-01-04', count: 20 },
      { date: '2025-01-05', count: 30 },
      { date: '2025-01-06', count: 25 },
      { date: '2025-01-07', count: 23 }
    ],
    crimesByLocation: [
      { key: 'Indiranagar', doc_count: 40 },
      { key: 'Koramangala', doc_count: 35 },
      { key: 'Jayanagar', doc_count: 25 },
      { key: 'MG Road', doc_count: 15 },
      { key: 'Whitefield', doc_count: 13 }
    ],
    topKeywords: [
      { keyword: 'theft', count: 50 },
      { keyword: 'vehicle', count: 30 },
      { keyword: 'assault', count: 25 },
      { keyword: 'fraud', count: 15 },
      { keyword: 'vandalism', count: 8 }
    ]
  };
}

  // Helper methods
  private calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }

  private calculateCosineSimilarity(a: number[], b: number[]): number {
    if (a.length !== b.length) return 0;
    
    let dotProduct = 0;
    let normA = 0;
    let normB = 0;
    
    for (let i = 0; i < a.length; i++) {
      dotProduct += a[i] * b[i];
      normA += a[i] * a[i];
      normB += b[i] * b[i];
    }
    
    return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
  }

  private getNestedValue(obj: any, path: string): any {
    return path.split('.').reduce((current, key) => current?.[key], obj);
  }

  private getPriorityWeight(priority: string): number {
    const weights = { 'Low': 1, 'Medium': 2, 'High': 3, 'Critical': 4 };
    return weights[priority as keyof typeof weights] || 1;
  }

  private aggregateByField(data: FIRDocument[], field: string): any {
    const aggregation: { [key: string]: number } = {};
    data.forEach(item => {
      const value = this.getNestedValue(item, field);
      aggregation[value] = (aggregation[value] || 0) + 1;
    });
    return Object.entries(aggregation).map(([key, value]) => ({ key, doc_count: value }));
  }

  private getTimeSeriesData(data: FIRDocument[]): any[] {
    const timeSeries: { [key: string]: number } = {};
    data.forEach(fir => {
      const date = fir.date;
      timeSeries[date] = (timeSeries[date] || 0) + 1;
    });
    return Object.entries(timeSeries)
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }

  private getTopKeywords(data: FIRDocument[]): Array<{ keyword: string; count: number }> {
    const keywordCounts: { [key: string]: number } = {};
    data.forEach(fir => {
      fir.keywords.forEach(keyword => {
        keywordCounts[keyword] = (keywordCounts[keyword] || 0) + 1;
      });
    });
    return Object.entries(keywordCounts)
      .map(([keyword, count]) => ({ keyword, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
  }

  private calculateAverageResolutionTime(data: FIRDocument[]): number {
    const resolvedCases = data.filter(fir => fir.status === 'Resolved');
    if (resolvedCases.length === 0) return 0;
    
    // Mock calculation - in reality would compare resolution date with filing date
    return Math.round(Math.random() * 30 + 5); // 5-35 days average
  }
}

export const elasticsearchService = new ElasticsearchService();
import { users, policies, policyAnalyses, type User, type InsertUser, type Policy, type InsertPolicy, type PolicyAnalysis, type InsertPolicyAnalysis } from "@shared/schema";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Policy operations
  getPolicy(id: number): Promise<Policy | undefined>;
  getPoliciesByUser(userId: number): Promise<Policy[]>;
  createPolicy(policy: InsertPolicy): Promise<Policy>;
  updatePolicy(id: number, updates: Partial<InsertPolicy>): Promise<Policy | undefined>;
  searchPolicies(userId: number, query: string): Promise<Policy[]>;
  
  // Policy analysis operations
  getAnalysesByPolicy(policyId: number): Promise<PolicyAnalysis[]>;
  createAnalysis(analysis: InsertPolicyAnalysis): Promise<PolicyAnalysis>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private policies: Map<number, Policy>;
  private policyAnalyses: Map<number, PolicyAnalysis>;
  private currentUserId: number;
  private currentPolicyId: number;
  private currentAnalysisId: number;

  constructor() {
    this.users = new Map();
    this.policies = new Map();
    this.policyAnalyses = new Map();
    this.currentUserId = 1;
    this.currentPolicyId = 1;
    this.currentAnalysisId = 1;
    
    // Initialize with a demo user
    this.createUser({
      username: "johndoe",
      password: "password123",
      email: "john@example.com",
      fullName: "John Doe",
      membershipType: "premium"
    });
    
    // Add sample policies for demonstration
    this.createPolicy({
      userId: 1,
      policyNumber: "AUTO-2024-001",
      policyName: "Comprehensive Auto Insurance",
      policyType: "auto",
      premiumAmount: "1200",
      coverageAmount: "50000",
      status: "active",
      lastAnalyzed: new Date(Date.now() - 86400000) // 1 day ago
    });
    
    this.createPolicy({
      userId: 1,
      policyNumber: "HOME-2024-002",
      policyName: "Homeowners Insurance Premium",
      policyType: "home",
      premiumAmount: "2400",
      coverageAmount: "300000",
      status: "active",
      lastAnalyzed: new Date(Date.now() - 172800000) // 2 days ago
    });
    
    this.createPolicy({
      userId: 1,
      policyNumber: "LIFE-2024-003",
      policyName: "Term Life Insurance",
      policyType: "life",
      premiumAmount: "800",
      coverageAmount: "500000",
      status: "active",
      lastAnalyzed: null
    });
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { 
      ...insertUser, 
      id, 
      createdAt: new Date(),
      membershipType: insertUser.membershipType || "basic"
    };
    this.users.set(id, user);
    return user;
  }

  async getPolicy(id: number): Promise<Policy | undefined> {
    return this.policies.get(id);
  }

  async getPoliciesByUser(userId: number): Promise<Policy[]> {
    return Array.from(this.policies.values()).filter(
      (policy) => policy.userId === userId
    );
  }

  async createPolicy(insertPolicy: InsertPolicy): Promise<Policy> {
    const id = this.currentPolicyId++;
    const policy: Policy = {
      ...insertPolicy,
      id,
      createdAt: new Date(),
      updatedAt: new Date(),
      status: insertPolicy.status || "active",
      coverageAmount: insertPolicy.coverageAmount || null,
      lastAnalyzed: insertPolicy.lastAnalyzed || null
    };
    this.policies.set(id, policy);
    return policy;
  }

  async updatePolicy(id: number, updates: Partial<InsertPolicy>): Promise<Policy | undefined> {
    const policy = this.policies.get(id);
    if (!policy) return undefined;
    
    const updatedPolicy: Policy = {
      ...policy,
      ...updates,
      updatedAt: new Date()
    };
    this.policies.set(id, updatedPolicy);
    return updatedPolicy;
  }

  async searchPolicies(userId: number, query: string): Promise<Policy[]> {
    const userPolicies = await this.getPoliciesByUser(userId);
    if (!query.trim()) return userPolicies;
    
    const searchTerm = query.toLowerCase();
    return userPolicies.filter(policy => 
      policy.policyName.toLowerCase().includes(searchTerm) ||
      policy.policyNumber.toLowerCase().includes(searchTerm) ||
      policy.policyType.toLowerCase().includes(searchTerm)
    );
  }

  async getAnalysesByPolicy(policyId: number): Promise<PolicyAnalysis[]> {
    return Array.from(this.policyAnalyses.values()).filter(
      (analysis) => analysis.policyId === policyId
    );
  }

  async createAnalysis(insertAnalysis: InsertPolicyAnalysis): Promise<PolicyAnalysis> {
    const id = this.currentAnalysisId++;
    const analysis: PolicyAnalysis = {
      ...insertAnalysis,
      id,
      createdAt: new Date(),
      analysisData: insertAnalysis.analysisData || null,
      riskScore: insertAnalysis.riskScore || null,
      recommendations: insertAnalysis.recommendations || null
    };
    this.policyAnalyses.set(id, analysis);
    return analysis;
  }
}

export const storage = new MemStorage();

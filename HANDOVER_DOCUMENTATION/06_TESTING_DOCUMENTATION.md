# JELAJAH WARISAN NUSANTARA - TESTING DOCUMENTATION

**Document Version:** 1.0  
**Last Updated:** January 2026  
**Testing Framework:** Vitest + Testing Library  
**Test Coverage Target:** 80%+  

## TABLE OF CONTENTS

1. [TESTING STRATEGY](#testing-strategy)
2. [TEST ENVIRONMENT SETUP](#test-environment-setup)
3. [UNIT TESTING](#unit-testing)
4. [INTEGRATION TESTING](#integration-testing)
5. [END-TO-END TESTING](#end-to-end-testing)
6. [PERFORMANCE TESTING](#performance-testing)
7. [SECURITY TESTING](#security-testing)
8. [TEST DATA MANAGEMENT](#test-data-management)
9. [TEST AUTOMATION](#test-automation)
10. [TEST REPORTING](#test-reporting)
11. [CONTINUOUS TESTING](#continuous-testing)

## TESTING STRATEGY

### Testing Pyramid
```
    E2E Tests (Few)
    ────────────────
  Integration Tests (Some)
  ──────────────────────
Unit Tests (Many)
──────────────────────
```

### Testing Levels
1. **Unit Testing:** Individual components and functions
2. **Integration Testing:** API endpoints and database interactions
3. **End-to-End Testing:** Complete user workflows
4. **Performance Testing:** Load and stress testing
5. **Security Testing:** Vulnerability and penetration testing

### Testing Principles
- **Test-Driven Development (TDD):** Write tests before implementation
- **Behavior-Driven Development (BDD):** Focus on user behavior
- **Continuous Testing:** Automated testing in CI/CD pipeline
- **Test Coverage:** Minimum 80% code coverage requirement
- **Quality Gates:** Tests must pass before deployment

## TEST ENVIRONMENT SETUP

### Test Environment Configuration

#### Frontend Test Environment
```bash
# Install test dependencies
pnpm install --save-dev vitest @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom

# Configure Vitest
# vitest.config.ts
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react-swc'

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
  },
})
```

#### Backend Test Environment
```bash
# Install test dependencies
npm install --save-dev vitest @types/node tsx

# Configure test database
# .env.test
NODE_ENV=test
DATABASE_URL=postgresql://test_user:test_pass@localhost:5432/museum_test
JWT_SECRET=test_secret_key
UPLOAD_PATH=./test_uploads
```

### Test Database Setup
```sql
-- Create test database
CREATE DATABASE museumcagarbudaya_test;

-- Create test user
CREATE USER test_user WITH PASSWORD 'test_password';

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE museumcagarbudaya_test TO test_user;

-- Run migrations on test database
npm run migrate -- --database-url=$DATABASE_URL_TEST
```

### Mock Services
```typescript
// src/test/mocks.ts
export const mockTranslationService = {
  translate: jest.fn().mockResolvedValue({
    translatedText: 'Test translation',
    sourceLang: 'id',
    targetLang: 'en'
  }),
  getSupportedLanguages: jest.fn().mockResolvedValue(['id', 'en', 'ar'])
};

export const mockEmailService = {
  sendEmail: jest.fn().mockResolvedValue(true),
  sendPasswordReset: jest.fn().mockResolvedValue(true)
};

export const mockFileService = {
  uploadFile: jest.fn().mockResolvedValue({
    filename: 'test-file.jpg',
    url: '/uploads/test-file.jpg',
    size: 1024
  })
};
```

## UNIT TESTING

### Frontend Unit Tests

#### Component Testing
```typescript
// src/components/__tests__/MuseumCard.test.tsx
import { render, screen } from '@testing-library/react';
import { MuseumCard } from '../MuseumCard';
import { mockMuseum } from '../../test/mocks';

describe('MuseumCard Component', () => {
  it('renders museum information correctly', () => {
    render(<MuseumCard museum={mockMuseum} />);
    
    expect(screen.getByText(mockMuseum.name)).toBeInTheDocument();
    expect(screen.getByText(mockMuseum.location.city)).toBeInTheDocument();
    expect(screen.getByText(mockMuseum.description)).toBeInTheDocument();
  });

  it('displays approval status badge', () => {
    render(<MuseumCard museum={{ ...mockMuseum, isApproved: true }} />);
    
    expect(screen.getByText('Approved')).toBeInTheDocument();
  });

  it('handles click events', () => {
    const handleClick = jest.fn();
    render(<MuseumCard museum={mockMuseum} onClick={handleClick} />);
    
    const card = screen.getByRole('button');
    card.click();
    
    expect(handleClick).toHaveBeenCalledWith(mockMuseum.id);
  });
});
```

#### Hook Testing
```typescript
// src/hooks/__tests__/useAuth.test.ts
import { renderHook, act } from '@testing-library/react';
import { useAuth } from '../useAuth';
import { AuthProvider } from '../../contexts/AuthContext';

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <AuthProvider>{children}</AuthProvider>
);

describe('useAuth Hook', () => {
  it('should login user successfully', async () => {
    const { result } = renderHook(() => useAuth(), { wrapper });
    
    await act(async () => {
      await result.current.login('test@example.com', 'password123');
    });
    
    expect(result.current.user).toBeDefined();
    expect(result.current.isAuthenticated).toBe(true);
  });

  it('should logout user', async () => {
    const { result } = renderHook(() => useAuth(), { wrapper });
    
    // Login first
    await act(async () => {
      await result.current.login('test@example.com', 'password123');
    });
    
    // Then logout
    await act(async () => {
      await result.current.logout();
    });
    
    expect(result.current.user).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
  });
});
```

#### Utility Function Testing
```typescript
// src/utils/__tests__/validators.test.ts
import { validateEmail, validatePassword, validatePhoneNumber } from '../validators';

describe('Validators', () => {
  describe('validateEmail', () => {
    it('should validate correct email addresses', () => {
      expect(validateEmail('test@example.com')).toBe(true);
      expect(validateEmail('user.name@domain.co.id')).toBe(true);
      expect(validateEmail('user+tag@example.com')).toBe(true);
    });

    it('should reject invalid email addresses', () => {
      expect(validateEmail('invalid-email')).toBe(false);
      expect(validateEmail('@example.com')).toBe(false);
      expect(validateEmail('test@')).toBe(false);
      expect(validateEmail('')).toBe(false);
    });
  });

  describe('validatePassword', () => {
    it('should validate strong passwords', () => {
      expect(validatePassword('StrongPassword123!')).toBe(true);
      expect(validatePassword('MyPassword123')).toBe(true);
    });

    it('should reject weak passwords', () => {
      expect(validatePassword('weak')).toBe(false);
      expect(validatePassword('12345678')).toBe(false);
      expect(validatePassword('password')).toBe(false);
      expect(validatePassword('')).toBe(false);
    });
  });
});
```

### Backend Unit Tests

#### Service Testing
```typescript
// backend/src/services/__tests__/authService.test.ts
import { authService } from '../authService';
import { pool } from '../../config/database';

jest.mock('../../config/database');

describe('AuthService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('register', () => {
    it('should register user successfully', async () => {
      const userData = {
        email: 'test@example.com',
        password: 'password123',
        fullName: 'Test User'
      };

      (pool.query as jest.Mock).mockResolvedValue({
        rows: [{
          id: 'uuid',
          email: userData.email,
          full_name: userData.fullName,
          role: 'public'
        }]
      });

      const result = await authService.register(userData);

      expect(result).toBeDefined();
      expect(result.email).toBe(userData.email);
      expect(result.role).toBe('public');
    });

    it('should throw error for duplicate email', async () => {
      const userData = {
        email: 'test@example.com',
        password: 'password123',
        fullName: 'Test User'
      };

      (pool.query as jest.Mock).mockRejectedValue({
        code: '23505', // PostgreSQL unique constraint violation
        detail: 'Key (email)=(test@example.com) already exists.'
      });

      await expect(authService.register(userData)).rejects.toThrow('Email already exists');
    });
  });

  describe('login', () => {
    it('should login user successfully', async () => {
      const loginData = {
        email: 'test@example.com',
        password: 'password123'
      };

      const mockUser = {
        id: 'uuid',
        email: loginData.email,
        password_hash: '$2b$10$hashedpassword',
        role: 'admin'
      };

      (pool.query as jest.Mock).mockResolvedValue({
        rows: [mockUser]
      });

      const result = await authService.login(loginData);

      expect(result).toBeDefined();
      expect(result.user.email).toBe(loginData.email);
      expect(result.token).toBeDefined();
    });
  });
});
```

#### Controller Testing
```typescript
// backend/src/controllers/__tests__/museumController.test.ts
import { Request, Response } from 'express';
import { museumController } from '../museumController';
import { museumService } from '../../services/museumService';

jest.mock('../../services/museumService');

describe('MuseumController', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: jest.Mock;

  beforeEach(() => {
    mockRequest = {};
    mockResponse = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis()
    };
    mockNext = jest.fn();
  });

  describe('getMuseums', () => {
    it('should return museums list', async () => {
      const mockMuseums = [
        { id: 'uuid1', name: 'Museum 1' },
        { id: 'uuid2', name: 'Museum 2' }
      ];

      (museumService.getMuseums as jest.Mock).mockResolvedValue(mockMuseums);

      await museumController.getMuseums(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        data: mockMuseums
      });
    });

    it('should handle errors', async () => {
      const error = new Error('Database error');
      (museumService.getMuseums as jest.Mock).mockRejectedValue(error);

      await museumController.getMuseums(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });
});
```

## INTEGRATION TESTING

### API Integration Tests

#### Authentication Integration
```typescript
// backend/src/__tests__/integration/auth.test.ts
import request from 'supertest';
import app from '../../server';
import { pool } from '../../config/database';

describe('Auth Integration Tests', () => {
  beforeEach(async () => {
    // Clean up test database
    await pool.query('TRUNCATE TABLE users RESTART IDENTITY CASCADE');
  });

  describe('POST /api/auth/register', () => {
    it('should register a new user', async () => {
      const userData = {
        email: 'test@example.com',
        password: 'password123',
        fullName: 'Test User'
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.user.email).toBe(userData.email);
      expect(response.body.data.user.password).toBeUndefined();
    });

    it('should reject duplicate email', async () => {
      const userData = {
        email: 'test@example.com',
        password: 'password123',
        fullName: 'Test User'
      };

      // Register first user
      await request(app)
        .post('/api/auth/register')
        .send(userData);

      // Try to register with same email
      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(409);

      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe('DUPLICATE_RESOURCE');
    });
  });

  describe('POST /api/auth/login', () => {
    beforeEach(async () => {
      // Create test user
      await pool.query(
        'INSERT INTO users (email, password_hash, full_name, role) VALUES ($1, $2, $3, $4)',
        ['test@example.com', '$2b$10$hashedpassword', 'Test User', 'admin']
      );
    });

    it('should login with valid credentials', async () => {
      const loginData = {
        email: 'test@example.com',
        password: 'password123'
      };

      const response = await request(app)
        .post('/api/auth/login')
        .send(loginData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.token).toBeDefined();
      expect(response.body.data.user.email).toBe(loginData.email);
    });

    it('should reject invalid credentials', async () => {
      const loginData = {
        email: 'test@example.com',
        password: 'wrongpassword'
      };

      const response = await request(app)
        .post('/api/auth/login')
        .send(loginData)
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe('AUTHENTICATION_ERROR');
    });
  });
});
```

#### Database Integration Tests
```typescript
// backend/src/__tests__/integration/database.test.ts
import { pool } from '../../config/database';

describe('Database Integration Tests', () => {
  beforeEach(async () => {
    // Clean up test data
    await pool.query('TRUNCATE TABLE museums RESTART IDENTITY CASCADE');
    await pool.query('TRUNCATE TABLE collections RESTART IDENTITY CASCADE');
  });

  describe('Museum CRUD Operations', () => {
    it('should create and retrieve museum', async () => {
      const museumData = {
        name: 'Test Museum',
        description: 'Test museum description',
        location: {
          address: 'Test Address',
          city: 'Test City',
          coordinates: [106.8273, -6.1750]
        }
      };

      // Create museum
      const createResult = await pool.query(
        'INSERT INTO museums (name, description, location) VALUES ($1, $2, $3) RETURNING *',
        [museumData.name, museumData.description, JSON.stringify(museumData.location)]
      );

      const createdMuseum = createResult.rows[0];

      // Retrieve museum
      const getResult = await pool.query(
        'SELECT * FROM museums WHERE id = $1',
        [createdMuseum.id]
      );

      expect(getResult.rows).toHaveLength(1);
      expect(getResult.rows[0].name).toBe(museumData.name);
      expect(JSON.parse(getResult.rows[0].location)).toEqual(museumData.location);
    });

    it('should update museum', async () => {
      // Create test museum
      const createResult = await pool.query(
        'INSERT INTO museums (name, description) VALUES ($1, $2) RETURNING *',
        ['Test Museum', 'Original description']
      );

      const museumId = createResult.rows[0].id;

      // Update museum
      await pool.query(
        'UPDATE museums SET description = $1 WHERE id = $2',
        ['Updated description', museumId]
      );

      // Verify update
      const getResult = await pool.query(
        'SELECT * FROM museums WHERE id = $1',
        [museumId]
      );

      expect(getResult.rows[0].description).toBe('Updated description');
    });
  });
});
```

### Frontend Integration Tests

#### API Service Integration
```typescript
// src/services/__tests__/apiService.test.ts
import { apiService } from '../apiService';
import axios from 'axios';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('APIService Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getMuseums', () => {
    it('should fetch museums successfully', async () => {
      const mockResponse = {
        data: {
          success: true,
          data: {
            museums: [
              { id: 'uuid1', name: 'Museum 1' },
              { id: 'uuid2', name: 'Museum 2' }
            ]
          }
        }
      };

      mockedAxios.get.mockResolvedValue(mockResponse);

      const result = await apiService.getMuseums();

      expect(mockedAxios.get).toHaveBeenCalledWith('/museums');
      expect(result).toEqual(mockResponse.data.data.museums);
    });

    it('should handle API errors', async () => {
      const error = {
        response: {
          data: {
            success: false,
            error: {
              message: 'Not found'
            }
          }
        }
      };

      mockedAxios.get.mockRejectedValue(error);

      await expect(apiService.getMuseums()).rejects.toThrow('Not found');
    });
  });

  describe('createMuseum', () => {
    it('should create museum successfully', async () => {
      const museumData = {
        name: 'New Museum',
        description: 'New museum description'
      };

      const mockResponse = {
        data: {
          success: true,
          data: {
            museum: {
              id: 'uuid',
              ...museumData
            }
          }
        }
      };

      mockedAxios.post.mockResolvedValue(mockResponse);

      const result = await apiService.createMuseum(museumData);

      expect(mockedAxios.post).toHaveBeenCalledWith('/museums', museumData);
      expect(result).toEqual(mockResponse.data.data.museum);
    });
  });
});
```

## END-TO-END TESTING

### E2E Test Setup
```typescript
// e2e/setup.ts
import { chromium, FullConfig } from '@playwright/test';

async function globalSetup(config: FullConfig) {
  // Setup test data and environment
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  // Create test user
  await page.goto('https://test.museumcagarbudaya.go.id/auth/register');
  await page.fill('[name="email"]', 'e2e-test@example.com');
  await page.fill('[name="password"]', 'e2ePassword123!');
  await page.click('button[type="submit"]');

  await browser.close();
}

export default globalSetup;
```

### E2E Test Examples
```typescript
// e2e/tests/museum-flow.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Museum Management Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Login as admin
    await page.goto('/auth/login');
    await page.fill('[name="email"]', 'admin@example.com');
    await page.fill('[name="password"]', 'adminPassword123!');
    await page.click('button[type="submit"]');
    await page.waitForURL('/admin');
  });

  test('admin can create and manage museums', async ({ page }) => {
    // Navigate to museum management
    await page.click('text=Museum Management');

    // Create new museum
    await page.click('button:has-text("Add Museum")');

    await page.fill('[name="name"]', 'E2E Test Museum');
    await page.fill('[name="description"]', 'Test museum for E2E testing');
    await page.fill('[name="location.address"]', 'Test Address');
    await page.fill('[name="location.city"]', 'Test City');

    await page.click('button:has-text("Save")');

    // Verify museum was created
    await expect(page.locator('text=E2E Test Museum')).toBeVisible();

    // Edit museum
    await page.click('button:has-text("Edit")');
    await page.fill('[name="description"]', 'Updated description');
    await page.click('button:has-text("Save")');

    // Verify update
    await expect(page.locator('text=Updated description')).toBeVisible();
  });

  test('user can browse and search museums', async ({ page }) => {
    // Navigate to public museum page
    await page.goto('/museums');

    // Search for museum
    await page.fill('[name="search"]', 'Test Museum');
    await page.press('[name="search"]', 'Enter');

    // Verify search results
    await expect(page.locator('.museum-card')).toHaveCountGreaterThan(0);

    // Click on museum to view details
    await page.click('.museum-card:first-child');
    await expect(page.locator('h1')).toBeVisible();
  });
});

test.describe('User Authentication Flow', () => {
  test('user can register and login', async ({ page }) => {
    // Navigate to registration
    await page.goto('/auth/register');

    // Fill registration form
    const email = `test-${Date.now()}@example.com`;
    await page.fill('[name="email"]', email);
    await page.fill('[name="password"]', 'TestPassword123!');
    await page.fill('[name="fullName"]', 'Test User');

    await page.click('button[type="submit"]');

    // Verify registration success
    await expect(page.locator('text=Registration successful')).toBeVisible();

    // Login with new account
    await page.goto('/auth/login');
    await page.fill('[name="email"]', email);
    await page.fill('[name="password"]', 'TestPassword123!');
    await page.click('button[type="submit"]');

    // Verify login success
    await expect(page.locator('text=Welcome')).toBeVisible();
  });
});
```

## PERFORMANCE TESTING

### Load Testing Setup
```typescript
// performance/load-test.ts
import { HttpUser, scenario, exec, sleep } from 'k6/http';
import { check, group } from 'k6';

export const options = {
  stages: [
    { duration: '2m', target: 100 }, // Ramp up to 100 users
    { duration: '5m', target: 100 }, // Stay at 100 users
    { duration: '2m', target: 200 }, // Ramp up to 200 users
    { duration: '5m', target: 200 }, // Stay at 200 users
    { duration: '2m', target: 0 },   // Ramp down to 0 users
  ],
  thresholds: {
    http_req_duration: ['p(95)<2000'], // 95% of requests should be below 2s
    http_req_failed: ['rate<0.1'],     // Error rate should be less than 10%
  },
};

export default function() {
  group('Public API Load Test', () => {
    // Test museum listing
    const museumsResponse = http.get('https://museumcagarbudaya.kemenbud.go.id/api/museums');
    check(museumsResponse, {
      'museums status is 200': (r) => r.status === 200,
      'museums response time < 1000ms': (r) => r.timings.duration < 1000,
    });

    sleep(1);

    // Test museum detail
    const museumId = '550e8400-e29b-41d4-a716-446655440000';
    const museumResponse = http.get(`https://museumcagarbudaya.kemenbud.go.id/api/museums/${museumId}`);
    check(museumResponse, {
      'museum detail status is 200': (r) => r.status === 200,
      'museum detail response time < 500ms': (r) => r.timings.duration < 500,
    });

    sleep(1);

    // Test collection listing
    const collectionsResponse = http.get(`https://museumcagarbudaya.kemenbud.go.id/api/collections?museum_id=${museumId}`);
    check(collectionsResponse, {
      'collections status is 200': (r) => r.status === 200,
      'collections response time < 1000ms': (r) => r.timings.duration < 1000,
    });
  });

  group('Authenticated API Load Test', () => {
    // Login
    const loginResponse = http.post('https://museumcagarbudaya.kemenbud.go.id/api/auth/login', JSON.stringify({
      email: 'loadtest@example.com',
      password: 'loadtest123'
    }), {
      headers: { 'Content-Type': 'application/json' }
    });

    check(loginResponse, {
      'login status is 200': (r) => r.status === 200,
    });

    const token = loginResponse.json('data.token');

    // Test authenticated endpoints
    const userResponse = http.get('https://museumcagarbudaya.kemenbud.go.id/api/users', {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    check(userResponse, {
      'user list status is 200': (r) => r.status === 200,
    });

    sleep(1);
  });
}
```

### Performance Monitoring
```typescript
// src/utils/performance-monitor.ts
export class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private metrics: Map<string, number[]> = new Map();

  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }

  startTimer(label: string): void {
    performance.mark(`${label}-start`);
  }

  endTimer(label: string): number {
    performance.mark(`${label}-end`);
    performance.measure(label, `${label}-start`, `${label}-end`);

    const measure = performance.getEntriesByName(label)[0];
    const duration = measure.duration;

    // Store metric
    if (!this.metrics.has(label)) {
      this.metrics.set(label, []);
    }
    this.metrics.get(label)!.push(duration);

    return duration;
  }

  getAverageTime(label: string): number {
    const times = this.metrics.get(label) || [];
    if (times.length === 0) return 0;

    const sum = times.reduce((acc, time) => acc + time, 0);
    return sum / times.length;
  }

  getMetrics(): Record<string, { average: number; count: number; min: number; max: number }> {
    const result: Record<string, any> = {};

    for (const [label, times] of this.metrics.entries()) {
      const min = Math.min(...times);
      const max = Math.max(...times);
      const average = this.getAverageTime(label);

      result[label] = {
        average,
        count: times.length,
        min,
        max
      };
    }

    return result;
  }
}

// Usage in components
export const usePerformanceMonitoring = () => {
  const monitor = PerformanceMonitor.getInstance();

  const measureRender = (componentName: string) => {
    return {
      start: () => monitor.startTimer(`${componentName}-render`),
      end: () => monitor.endTimer(`${componentName}-render`)
    };
  };

  return { measureRender };
};
```

## SECURITY TESTING

### Security Test Suite
```typescript
// backend/src/__tests__/security/auth-security.test.ts
import request from 'supertest';
import app from '../../server';

describe('Security Tests', () => {
  describe('Authentication Security', () => {
    it('should reject requests without authentication', async () => {
      const response = await request(app)
        .get('/api/users')
        .expect(401);

      expect(response.body.error.code).toBe('AUTHENTICATION_ERROR');
    });

    it('should reject invalid JWT tokens', async () => {
      const response = await request(app)
        .get('/api/users')
        .set('Authorization', 'Bearer invalid-token')
        .expect(401);

      expect(response.body.error.code).toBe('AUTHENTICATION_ERROR');
    });

    it('should prevent SQL injection', async () => {
      const maliciousInput = "'; DROP TABLE users; --";

      const response = await request(app)
        .get(`/api/museums?search=${encodeURIComponent(maliciousInput)}`)
        .expect(200);

      // Should not cause database error
      expect(response.body.success).toBe(true);
    });

    it('should prevent XSS attacks', async () => {
      const xssPayload = '<script>alert("XSS")</script>';

      const response = await request(app)
        .post('/api/museums')
        .send({
          name: xssPayload,
          description: xssPayload
        })
        .expect(422);

      // Should validate and sanitize input
      expect(response.body.error.details).toBeDefined();
    });
  });

  describe('Rate Limiting', () => {
    it('should enforce rate limits', async () => {
      const requests = [];

      // Make multiple rapid requests
      for (let i = 0; i < 10; i++) {
        requests.push(
          request(app)
            .get('/api/museums')
            .set('X-Forwarded-For', '127.0.0.1')
        );
      }

      const responses = await Promise.all(requests);

      // Some requests should be rate limited
      const rateLimitedResponses = responses.filter(r => r.status === 429);
      expect(rateLimitedResponses.length).toBeGreaterThan(0);
    });
  });

  describe('File Upload Security', () => {
    it('should reject dangerous file types', async () => {
      const response = await request(app)
        .post('/api/upload')
        .attach('file', Buffer.from('malicious content'), 'malicious.exe')
        .expect(400);

      expect(response.body.error.code).toBe('FILE_UPLOAD_ERROR');
    });

    it('should enforce file size limits', async () => {
      const largeFile = Buffer.alloc(60 * 1024 * 1024); // 60MB

      const response = await request(app)
        .post('/api/upload')
        .attach('file', largeFile, 'large-file.jpg')
        .expect(400);

      expect(response.body.error.code).toBe('FILE_UPLOAD_ERROR');
    });
  });
});
```

## TEST DATA MANAGEMENT

### Test Data Factory
```typescript
// src/test/factories.ts
import { faker } from '@faker-js/faker';

export const createMockUser = (overrides = {}) => ({
  id: faker.string.uuid(),
  email: faker.internet.email(),
  full_name: faker.person.fullName(),
  role: faker.helpers.arrayElement(['admin', 'content_manager', 'public']),
  is_active: true,
  email_verified: true,
  created_at: faker.date.past().toISOString(),
  ...overrides
});

export const createMockMuseum = (overrides = {}) => ({
  id: faker.string.uuid(),
  name: faker.company.name(),
  description: faker.lorem.paragraph(),
  location: {
    address: faker.location.streetAddress(),
    city: faker.location.city(),
    province: faker.location.state(),
    coordinates: [faker.location.longitude(), faker.location.latitude()]
  },
  contact_info: {
    phone: faker.phone.number(),
    email: faker.internet.email(),
    website: faker.internet.url()
  },
  opening_hours: {
    monday: '09:00-17:00',
    tuesday: '09:00-17:00',
    wednesday: '09:00-17:00',
    thursday: '09:00-17:00',
    friday: '09:00-17:00',
    saturday: '10:00-16:00',
    sunday: '10:00-16:00'
  },
  admission_fee: faker.number.int({ min: 0, max: 50000 }),
  facilities: faker.helpers.arrayElements(['parking', 'cafe', 'wifi', 'toilets', 'guided_tour']),
  is_approved: faker.datatype.boolean(),
  created_at: faker.date.past().toISOString(),
  ...overrides
});

export const createMockCollection = (overrides = {}) => ({
  id: faker.string.uuid(),
  museum_id: faker.string.uuid(),
  name: faker.lorem.words(3),
  description: faker.lorem.paragraph(),
  category: faker.helpers.arrayElement(['art', 'historical', 'archaeological', 'ethnographic', 'natural_history']),
  acquisition_date: faker.date.past().toISOString().split('T')[0],
  provenance: faker.lorem.sentence(),
  condition_status: faker.helpers.arrayElement(['excellent', 'good', 'fair', 'poor']),
  media_files: [
    {
      filename: faker.system.fileName(),
      url: `/uploads/${faker.system.fileName()}`,
      type: 'image'
    }
  ],
  is_approved: faker.datatype.boolean(),
  created_at: faker.date.past().toISOString(),
  ...overrides
});
```

### Test Database Seeding
```typescript
// backend/src/test/seeder.ts
import { pool } from '../config/database';
import { createMockUser, createMockMuseum, createMockCollection } from './factories';

export class TestSeeder {
  static async seed() {
    // Clean existing data
    await this.clean();

    // Create test users
    const adminUser = await this.createUser({
      email: 'admin@example.com',
      role: 'admin',
      full_name: 'Admin User'
    });

    const contentManager = await this.createUser({
      email: 'manager@example.com',
      role: 'content_manager',
      full_name: 'Content Manager'
    });

    const publicUser = await this.createUser({
      email: 'user@example.com',
      role: 'public',
      full_name: 'Public User'
    });

    // Create test museums
    const museums = [];
    for (let i = 0; i < 10; i++) {
      const museum = await this.createMuseum({
        name: `Test Museum ${i + 1}`,
        is_approved: i % 2 === 0 // Alternate approval status
      });
      museums.push(museum);
    }

    // Create test collections
    for (const museum of museums) {
      for (let i = 0; i < 3; i++) {
        await this.createCollection({
          museum_id: museum.id,
          name: `Collection ${i + 1} - ${museum.name}`,
          is_approved: i % 2 === 0
        });
      }
    }

    return {
      adminUser,
      contentManager,
      publicUser,
      museums
    };
  }

  static async clean() {
    await pool.query('TRUNCATE TABLE activity_logs RESTART IDENTITY CASCADE');
    await pool.query('TRUNCATE TABLE translations RESTART IDENTITY CASCADE');
    await pool.query('TRUNCATE TABLE collections RESTART IDENTITY CASCADE');
    await pool.query('TRUNCATE TABLE museums RESTART IDENTITY CASCADE');
    await pool.query('TRUNCATE TABLE users RESTART IDENTITY CASCADE');
  }

  static async createUser(userData: any) {
    const result = await pool.query(
      'INSERT INTO users (email, password_hash, full_name, role, is_active, email_verified) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [
        userData.email,
        '$2b$10$hashedpassword', // Fixed hash for testing
        userData.full_name,
        userData.role,
        userData.is_active ?? true,
        userData.email_verified ?? true
      ]
    );
    return result.rows[0];
  }

  static async createMuseum(museumData: any) {
    const result = await pool.query(
      'INSERT INTO museums (name, description, location, is_approved) VALUES ($1, $2, $3, $4) RETURNING *',
      [
        museumData.name,
        museumData.description,
        JSON.stringify(museumData.location),
        museumData.is_approved ?? false
      ]
    );
    return result.rows[0];
  }

  static async createCollection(collectionData: any) {
    const result = await pool.query(
      'INSERT INTO collections (museum_id, name, description, category, is_approved) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [
        collectionData.museum_id,
        collectionData.name,
        collectionData.description,
        collectionData.category,
        collectionData.is_approved ?? false
      ]
    );
    return result.rows[0];
  }
}
```

## TEST AUTOMATION

### CI/CD Pipeline Integration
```yaml
# .github/workflows/test.yml
name: Test Pipeline

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest

    services:
      postgres:
        image: postgres:14
        env:
          POSTGRES_PASSWORD: postgres
          POSTGRES_DB: museum_test
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5

    steps:
    - uses: actions/checkout@v3

    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'

    - name: Install dependencies
      run: |
        cd backend
        npm install
        cd ../frontend
        pnpm install

    - name: Run backend tests
      run: |
        cd backend
        npm run test
      env:
        DATABASE_URL: postgresql://postgres:postgres@localhost:5432/museum_test
        NODE_ENV: test

    - name: Run frontend tests
      run: |
        cd frontend
        pnpm run test
      env:
        VITE_API_BASE_URL: http://localhost:3000/api

    - name: Run integration tests
      run: |
        cd backend
        npm run test:integration
      env:
        DATABASE_URL: postgresql://postgres:postgres@localhost:5432/museum_test
        NODE_ENV: test

    - name: Generate test coverage
      run: |
        cd backend
        npm run test:coverage
        cd ../frontend
        pnpm run test:coverage

    - name: Upload coverage to Codecov
      uses: codecov/codecov-action@v3
      with:
        file: ./coverage/lcov.info
        flags: unittests
        name: codecov-umbrella
```

### Test Scripts
```json
// package.json scripts
{
  "scripts": {
    "test": "vitest",
    "test:watch": "vitest --watch",
    "test:coverage": "vitest --coverage",
    "test:unit": "vitest run src/**/*.test.ts",
    "test:integration": "vitest run src/**/*.integration.test.ts",
    "test:e2e": "playwright test",
    "test:security": "vitest run src/**/*.security.test.ts",
    "test:performance": "k6 run performance/load-test.js"
  }
}
```

## TEST REPORTING

### Test Report Generation
```typescript
// scripts/generate-test-report.ts
import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

interface TestResult {
  suite: string;
  tests: Test[];
  coverage: Coverage;
}

interface Test {
  name: string;
  status: 'passed' | 'failed' | 'skipped';
  duration: number;
  error?: string;
}

interface Coverage {
  lines: { total: number; covered: number; percentage: number };
  functions: { total: number; covered: number; percentage: number };
  branches: { total: number; covered: number; percentage: number };
  statements: { total: number; covered: number; percentage: number };
}

export function generateTestReport(results: TestResult[]): void {
  const report = {
    timestamp: new Date().toISOString(),
    summary: {
      totalSuites: results.length,
      totalTests: results.reduce((acc, suite) => acc + suite.tests.length, 0),
      passedTests: results.reduce((acc, suite) => 
        acc + suite.tests.filter(t => t.status === 'passed').length, 0),
      failedTests: results.reduce((acc, suite) => 
        acc + suite.tests.filter(t => t.status === 'failed').length, 0),
      skippedTests: results.reduce((acc, suite) => 
        acc + suite.tests.filter(t => t.status === 'skipped').length, 0)
    },
    suites: results,
    coverage: calculateOverallCoverage(results.map(r => r.coverage))
  };

  const reportPath = join(process.cwd(), 'test-reports', `test-report-${Date.now()}.json`);
  writeFileSync(reportPath, JSON.stringify(report, null, 2));

  console.log(`Test report generated: ${reportPath}`);
  console.log(`Total tests: ${report.summary.totalTests}`);
  console.log(`Passed: ${report.summary.passedTests}`);
  console.log(`Failed: ${report.summary.failedTests}`);
  console.log(`Coverage: ${report.coverage.lines.percentage}%`);
}

function calculateOverallCoverage(coverages: Coverage[]): Coverage {
  const totalLines = coverages.reduce((acc, c) => acc + c.lines.total, 0);
  const coveredLines = coverages.reduce((acc, c) => acc + c.lines.covered, 0);
  const linePercentage = totalLines > 0 ? (coveredLines / totalLines) * 100 : 0;

  // Similar calculations for functions, branches, statements
  // ...

  return {
    lines: { total: totalLines, covered: coveredLines, percentage: linePercentage },
    functions: { total: 0, covered: 0, percentage: 0 },
    branches: { total: 0, covered: 0, percentage: 0 },
    statements: { total: 0, covered: 0, percentage: 0 }
  };
}
```

### Dashboard Integration
```typescript
// src/test/dashboard.ts
export class TestDashboard {
  private static instance: TestDashboard;
  private testResults: TestResult[] = [];

  static getInstance(): TestDashboard {
    if (!TestDashboard.instance) {
      TestDashboard.instance = new TestDashboard();
    }
    return TestDashboard.instance;
  }

  addTestResult(result: TestResult): void {
    this.testResults.push(result);
    this.updateDashboard();
  }

  private updateDashboard(): void {
    // Update real-time dashboard
    const summary = this.getSummary();
    
    // Send to monitoring system
    this.sendToMonitoring(summary);
    
    // Update UI if in development
    if (process.env.NODE_ENV === 'development') {
      this.updateUI(summary);
    }
  }

  private getSummary(): any {
    return {
      totalTests: this.testResults.reduce((acc, suite) => acc + suite.tests.length, 0),
      passedTests: this.testResults.reduce((acc, suite) => 
        acc + suite.tests.filter(t => t.status === 'passed').length, 0),
      failedTests: this.testResults.reduce((acc, suite) => 
        acc + suite.tests.filter(t => t.status === 'failed').length, 0),
      coverage: this.getOverallCoverage()
    };
  }

  private sendToMonitoring(summary: any): void {
    // Send to monitoring system (Grafana, DataDog, etc.)
    // Implementation depends on monitoring system
  }

  private updateUI(summary: any): void {
    // Update development dashboard UI
    // Implementation depends on UI framework
  }
}
```

## CONTINUOUS TESTING

### Pre-commit Hooks
```json
// .husky/pre-commit
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

# Run linting
npm run lint

# Run tests
npm run test

# Run type checking
npm run typecheck

# Run security scan
npm run security:scan
```

### Quality Gates
```typescript
// scripts/quality-gates.ts
export class QualityGates {
  static async checkAll(): Promise<boolean> {
    const checks = [
      this.checkTestCoverage(),
      this.checkSecurityVulnerabilities(),
      this.checkCodeQuality(),
      this.checkPerformanceBudget()
    ];

    const results = await Promise.all(checks);
    const allPassed = results.every(result => result);

    if (!allPassed) {
      console.error('Quality gates failed. Deployment blocked.');
      process.exit(1);
    }

    return true;
  }

  private static async checkTestCoverage(): Promise<boolean> {
    // Check if test coverage meets minimum threshold
    const coverage = await this.getTestCoverage();
    const threshold = 80; // 80% minimum coverage

    if (coverage < threshold) {
      console.error(`Test coverage ${coverage}% is below threshold ${threshold}%`);
      return false;
    }

    return true;
  }

  private static async checkSecurityVulnerabilities(): Promise<boolean> {
    // Run security scan
    const vulnerabilities = await this.scanSecurity();
    
    if (vulnerabilities.length > 0) {
      console.error('Security vulnerabilities found:', vulnerabilities);
      return false;
    }

    return true;
  }

  private static async checkCodeQuality(): Promise<boolean> {
    // Check code quality metrics
    const quality = await this.getCodeQuality();
    
    if (quality.score < 8) {
      console.error(`Code quality score ${quality.score} is below threshold 8`);
      return false;
    }

    return true;
  }

  private static async checkPerformanceBudget(): Promise<boolean> {
    // Check performance metrics
    const performance = await this.getPerformanceMetrics();
    
    if (performance.lighthouseScore < 90) {
      console.error(`Lighthouse score ${performance.lighthouseScore} is below threshold 90`);
      return false;
    }

    return true;
  }
}
```

---

**Document Prepared By:** Quality Assurance Team  
**Next Review Date:** April 2026  
**Distribution:** Development Team, QA Team, DevOps Team
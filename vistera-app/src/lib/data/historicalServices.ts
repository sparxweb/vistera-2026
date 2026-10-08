// ==============================================================================
// FOODFLOW: Illustrative Demo Hotel Dataset
// Facility: Deccan Grand Hotel — Hyderabad (Capacity: 1000 meals/service)
// Problem: VISTERA 2026 PS-44 — Cutting Food Waste
// Notice: These records represent a 30-day illustrative operational dataset
//         modeled for an Indian hospitality & banqueting kitchen, used by
//         the deterministic forecast engine and pattern analysis module.
// ==============================================================================

import { FoodUnit, ServiceType, PatternAnalysisOutput } from '@/types/foodflow';

export const DEMO_HOTEL_DATASET_LABEL = 'Illustrative Demo Hotel Dataset';

export interface HistoricalDishRecord {
  dishName: string;
  category: 'Staple' | 'Dal & Gravy' | 'Curry / Protein' | 'Side' | 'Dairy';
  unit: FoodUnit;
  preparedQuantity: number;
  servedQuantity: number;
  leftoverQuantity: number;
  wasteQuantity: number; // Only non-recoverable portion
  perDinerRate: number; // consumed / actualDiners
}

export interface HistoricalServiceRecord {
  id: string;
  hotelId?: string;
  serviceDate: string;
  dayOfWeek: string;
  isWeekend?: boolean;
  mealType: 'Breakfast' | 'Lunch' | 'Dinner';
  serviceType?: ServiceType;
  context: 'Standard' | 'Exam Week' | 'Heavy Rain' | 'Weekend / Event';
  specialEvent?: boolean;
  eventName?: string;
  expectedCustomers?: number;
  actualCustomers?: number;
  expectedDiners: number; // backwards compatibility alias
  actualDiners: number;   // backwards compatibility alias
  attendanceRatio: number; // actual / expected
  foodPrepared?: number; // total kg/portions equivalent
  foodServed?: number;
  foodRemaining?: number;
  foodWasted?: number;
  dishes: HistoricalDishRecord[];
  notes?: string;
}

export function normalizeRecord(r: HistoricalServiceRecord) {
  const serviceType: ServiceType = (r.serviceType || r.mealType.toUpperCase()) as ServiceType;
  const isWeekend = r.isWeekend ?? (r.dayOfWeek === 'Saturday' || r.dayOfWeek === 'Sunday');
  const expected = r.expectedCustomers ?? r.expectedDiners;
  const actual = r.actualCustomers ?? r.actualDiners;
  const prep = r.foodPrepared ?? Math.round(expected * 0.98);
  const srv = r.foodServed ?? actual;
  const rem = r.foodRemaining ?? Math.max(0, prep - srv);
  return {
    ...r,
    hotelId: r.hotelId || 'HOTEL-DECCAN-HYD',
    serviceType,
    isWeekend,
    specialEvent: r.specialEvent ?? (r.context === 'Weekend / Event' || !!r.eventName),
    eventName: r.eventName || (r.context === 'Weekend / Event' ? 'Deccan Grand Special Service' : undefined),
    expectedCustomers: expected,
    actualCustomers: actual,
    expectedDiners: expected,
    actualDiners: actual,
    attendanceRatio: r.attendanceRatio || (actual / expected),
    foodPrepared: prep,
    foodServed: srv,
    foodRemaining: rem,
    foodWasted: r.foodWasted ?? Math.round(actual * 0.01),
  };
}



export const HISTORICAL_SERVICES: HistoricalServiceRecord[] = [
  // WEEK 1
  {
    id: 'SRV-HYD-001',
    serviceDate: 'Day 1 (3 weeks ago)',
    dayOfWeek: 'Monday',
    mealType: 'Lunch',
    context: 'Standard',
    expectedDiners: 780,
    actualDiners: 742,
    attendanceRatio: 0.9513,
    dishes: [
      { dishName: 'Steamed Sona Masoori Rice', category: 'Staple', unit: 'kg', preparedQuantity: 42.0, servedQuantity: 39.0, leftoverQuantity: 3.0, wasteQuantity: 0.2, perDinerRate: 0.0526 },
      { dishName: 'Tomato Dal / Dal Tadka', category: 'Dal & Gravy', unit: 'L', preparedQuantity: 18.0, servedQuantity: 16.0, leftoverQuantity: 2.0, wasteQuantity: 0.3, perDinerRate: 0.0216 },
      { dishName: 'Andhra Chicken Curry', category: 'Curry / Protein', unit: 'kg', preparedQuantity: 30.0, servedQuantity: 28.5, leftoverQuantity: 1.5, wasteQuantity: 0.0, perDinerRate: 0.0384 },
      { dishName: 'Mixed Vegetable Korma', category: 'Curry / Protein', unit: 'kg', preparedQuantity: 17.0, servedQuantity: 15.6, leftoverQuantity: 1.4, wasteQuantity: 0.1, perDinerRate: 0.0210 },
      { dishName: 'Fresh Set Curd', category: 'Dairy', unit: 'L', preparedQuantity: 12.0, servedQuantity: 11.1, leftoverQuantity: 0.9, wasteQuantity: 0.0, perDinerRate: 0.0150 },
    ],
  },
  {
    id: 'SRV-HYD-002',
    serviceDate: 'Day 2',
    dayOfWeek: 'Tuesday',
    mealType: 'Lunch',
    context: 'Standard',
    expectedDiners: 820,
    actualDiners: 790,
    attendanceRatio: 0.9634,
    dishes: [
      { dishName: 'Steamed Sona Masoori Rice', category: 'Staple', unit: 'kg', preparedQuantity: 45.0, servedQuantity: 41.5, leftoverQuantity: 3.5, wasteQuantity: 0.3, perDinerRate: 0.0525 },
      { dishName: 'Tomato Dal / Dal Tadka', category: 'Dal & Gravy', unit: 'L', preparedQuantity: 19.0, servedQuantity: 17.0, leftoverQuantity: 2.0, wasteQuantity: 0.2, perDinerRate: 0.0215 },
      { dishName: 'Andhra Chicken Curry', category: 'Curry / Protein', unit: 'kg', preparedQuantity: 32.0, servedQuantity: 30.4, leftoverQuantity: 1.6, wasteQuantity: 0.0, perDinerRate: 0.0385 },
      { dishName: 'Mixed Vegetable Korma', category: 'Curry / Protein', unit: 'kg', preparedQuantity: 18.0, servedQuantity: 16.6, leftoverQuantity: 1.4, wasteQuantity: 0.1, perDinerRate: 0.0210 },
      { dishName: 'Fresh Set Curd', category: 'Dairy', unit: 'L', preparedQuantity: 13.0, servedQuantity: 11.9, leftoverQuantity: 1.1, wasteQuantity: 0.0, perDinerRate: 0.0151 },
    ],
  },
  {
    id: 'SRV-HYD-003',
    serviceDate: 'Day 3',
    dayOfWeek: 'Wednesday',
    mealType: 'Lunch',
    context: 'Standard',
    expectedDiners: 800,
    actualDiners: 775,
    attendanceRatio: 0.9688,
    dishes: [
      { dishName: 'Steamed Sona Masoori Rice', category: 'Staple', unit: 'kg', preparedQuantity: 43.5, servedQuantity: 40.8, leftoverQuantity: 2.7, wasteQuantity: 0.2, perDinerRate: 0.0526 },
      { dishName: 'Tomato Dal / Dal Tadka', category: 'Dal & Gravy', unit: 'L', preparedQuantity: 18.5, servedQuantity: 16.7, leftoverQuantity: 1.8, wasteQuantity: 0.2, perDinerRate: 0.0215 },
      { dishName: 'Andhra Chicken Curry', category: 'Curry / Protein', unit: 'kg', preparedQuantity: 31.0, servedQuantity: 29.8, leftoverQuantity: 1.2, wasteQuantity: 0.0, perDinerRate: 0.0385 },
      { dishName: 'Mixed Vegetable Korma', category: 'Curry / Protein', unit: 'kg', preparedQuantity: 17.5, servedQuantity: 16.3, leftoverQuantity: 1.2, wasteQuantity: 0.1, perDinerRate: 0.0210 },
      { dishName: 'Fresh Set Curd', category: 'Dairy', unit: 'L', preparedQuantity: 12.5, servedQuantity: 11.6, leftoverQuantity: 0.9, wasteQuantity: 0.0, perDinerRate: 0.0150 },
    ],
  },
  {
    id: 'SRV-HYD-004',
    serviceDate: 'Day 4',
    dayOfWeek: 'Thursday',
    mealType: 'Lunch',
    context: 'Heavy Rain',
    expectedDiners: 850,
    actualDiners: 780,
    attendanceRatio: 0.9176,
    dishes: [
      { dishName: 'Steamed Sona Masoori Rice', category: 'Staple', unit: 'kg', preparedQuantity: 46.0, servedQuantity: 41.0, leftoverQuantity: 5.0, wasteQuantity: 0.4, perDinerRate: 0.0526 },
      { dishName: 'Tomato Dal / Dal Tadka', category: 'Dal & Gravy', unit: 'L', preparedQuantity: 20.0, servedQuantity: 16.8, leftoverQuantity: 3.2, wasteQuantity: 0.4, perDinerRate: 0.0215 },
      { dishName: 'Andhra Chicken Curry', category: 'Curry / Protein', unit: 'kg', preparedQuantity: 33.0, servedQuantity: 30.0, leftoverQuantity: 3.0, wasteQuantity: 0.0, perDinerRate: 0.0385 },
      { dishName: 'Mixed Vegetable Korma', category: 'Curry / Protein', unit: 'kg', preparedQuantity: 18.5, servedQuantity: 16.4, leftoverQuantity: 2.1, wasteQuantity: 0.2, perDinerRate: 0.0210 },
      { dishName: 'Fresh Set Curd', category: 'Dairy', unit: 'L', preparedQuantity: 13.0, servedQuantity: 11.7, leftoverQuantity: 1.3, wasteQuantity: 0.0, perDinerRate: 0.0150 },
    ],
    notes: 'Rain kept day-scholars home; attendance conversion dropped ~5%.',
  },
  {
    id: 'SRV-HYD-005',
    serviceDate: 'Day 5',
    dayOfWeek: 'Friday',
    mealType: 'Lunch',
    context: 'Standard',
    expectedDiners: 840,
    actualDiners: 815,
    attendanceRatio: 0.9702,
    dishes: [
      { dishName: 'Steamed Sona Masoori Rice', category: 'Staple', unit: 'kg', preparedQuantity: 46.0, servedQuantity: 42.8, leftoverQuantity: 3.2, wasteQuantity: 0.2, perDinerRate: 0.0525 },
      { dishName: 'Tomato Dal / Dal Tadka', category: 'Dal & Gravy', unit: 'L', preparedQuantity: 19.5, servedQuantity: 17.5, leftoverQuantity: 2.0, wasteQuantity: 0.2, perDinerRate: 0.0215 },
      { dishName: 'Andhra Chicken Curry', category: 'Curry / Protein', unit: 'kg', preparedQuantity: 33.0, servedQuantity: 31.4, leftoverQuantity: 1.6, wasteQuantity: 0.0, perDinerRate: 0.0385 },
      { dishName: 'Mixed Vegetable Korma', category: 'Curry / Protein', unit: 'kg', preparedQuantity: 18.5, servedQuantity: 17.1, leftoverQuantity: 1.4, wasteQuantity: 0.1, perDinerRate: 0.0210 },
      { dishName: 'Fresh Set Curd', category: 'Dairy', unit: 'L', preparedQuantity: 13.0, servedQuantity: 12.2, leftoverQuantity: 0.8, wasteQuantity: 0.0, perDinerRate: 0.0150 },
    ],
  },

  // WEEK 2
  {
    id: 'SRV-HYD-006',
    serviceDate: 'Day 8',
    dayOfWeek: 'Monday',
    mealType: 'Lunch',
    context: 'Standard',
    expectedDiners: 790,
    actualDiners: 760,
    attendanceRatio: 0.9620,
    dishes: [
      { dishName: 'Steamed Sona Masoori Rice', category: 'Staple', unit: 'kg', preparedQuantity: 43.0, servedQuantity: 40.0, leftoverQuantity: 3.0, wasteQuantity: 0.2, perDinerRate: 0.0526 },
      { dishName: 'Tomato Dal / Dal Tadka', category: 'Dal & Gravy', unit: 'L', preparedQuantity: 18.0, servedQuantity: 16.3, leftoverQuantity: 1.7, wasteQuantity: 0.2, perDinerRate: 0.0214 },
      { dishName: 'Andhra Chicken Curry', category: 'Curry / Protein', unit: 'kg', preparedQuantity: 31.0, servedQuantity: 29.3, leftoverQuantity: 1.7, wasteQuantity: 0.0, perDinerRate: 0.0386 },
      { dishName: 'Mixed Vegetable Korma', category: 'Curry / Protein', unit: 'kg', preparedQuantity: 17.5, servedQuantity: 16.0, leftoverQuantity: 1.5, wasteQuantity: 0.1, perDinerRate: 0.0211 },
      { dishName: 'Fresh Set Curd', category: 'Dairy', unit: 'L', preparedQuantity: 12.5, servedQuantity: 11.4, leftoverQuantity: 1.1, wasteQuantity: 0.0, perDinerRate: 0.0150 },
    ],
  },
  {
    id: 'SRV-HYD-007',
    serviceDate: 'Day 9',
    dayOfWeek: 'Tuesday',
    mealType: 'Lunch',
    context: 'Standard',
    expectedDiners: 810,
    actualDiners: 785,
    attendanceRatio: 0.9691,
    dishes: [
      { dishName: 'Steamed Sona Masoori Rice', category: 'Staple', unit: 'kg', preparedQuantity: 44.0, servedQuantity: 41.3, leftoverQuantity: 2.7, wasteQuantity: 0.2, perDinerRate: 0.0526 },
      { dishName: 'Tomato Dal / Dal Tadka', category: 'Dal & Gravy', unit: 'L', preparedQuantity: 18.5, servedQuantity: 16.9, leftoverQuantity: 1.6, wasteQuantity: 0.2, perDinerRate: 0.0215 },
      { dishName: 'Andhra Chicken Curry', category: 'Curry / Protein', unit: 'kg', preparedQuantity: 31.5, servedQuantity: 30.2, leftoverQuantity: 1.3, wasteQuantity: 0.0, perDinerRate: 0.0385 },
      { dishName: 'Mixed Vegetable Korma', category: 'Curry / Protein', unit: 'kg', preparedQuantity: 18.0, servedQuantity: 16.5, leftoverQuantity: 1.5, wasteQuantity: 0.1, perDinerRate: 0.0210 },
      { dishName: 'Fresh Set Curd', category: 'Dairy', unit: 'L', preparedQuantity: 12.5, servedQuantity: 11.8, leftoverQuantity: 0.7, wasteQuantity: 0.0, perDinerRate: 0.0150 },
    ],
  },
  {
    id: 'SRV-HYD-008',
    serviceDate: 'Day 10',
    dayOfWeek: 'Wednesday',
    mealType: 'Lunch',
    context: 'Exam Week',
    expectedDiners: 800,
    actualDiners: 730,
    attendanceRatio: 0.9125,
    dishes: [
      { dishName: 'Steamed Sona Masoori Rice', category: 'Staple', unit: 'kg', preparedQuantity: 43.0, servedQuantity: 38.4, leftoverQuantity: 4.6, wasteQuantity: 0.3, perDinerRate: 0.0526 },
      { dishName: 'Tomato Dal / Dal Tadka', category: 'Dal & Gravy', unit: 'L', preparedQuantity: 18.5, servedQuantity: 15.7, leftoverQuantity: 2.8, wasteQuantity: 0.3, perDinerRate: 0.0215 },
      { dishName: 'Andhra Chicken Curry', category: 'Curry / Protein', unit: 'kg', preparedQuantity: 31.0, servedQuantity: 28.1, leftoverQuantity: 2.9, wasteQuantity: 0.0, perDinerRate: 0.0385 },
      { dishName: 'Mixed Vegetable Korma', category: 'Curry / Protein', unit: 'kg', preparedQuantity: 17.5, servedQuantity: 15.3, leftoverQuantity: 2.2, wasteQuantity: 0.2, perDinerRate: 0.0210 },
      { dishName: 'Fresh Set Curd', category: 'Dairy', unit: 'L', preparedQuantity: 12.5, servedQuantity: 11.0, leftoverQuantity: 1.5, wasteQuantity: 0.0, perDinerRate: 0.0151 },
    ],
    notes: 'Semester mid-terms; library study shift delayed lunch turnout.',
  },
  {
    id: 'SRV-HYD-009',
    serviceDate: 'Day 11',
    dayOfWeek: 'Thursday',
    mealType: 'Lunch',
    context: 'Standard',
    expectedDiners: 830,
    actualDiners: 805,
    attendanceRatio: 0.9699,
    dishes: [
      { dishName: 'Steamed Sona Masoori Rice', category: 'Staple', unit: 'kg', preparedQuantity: 45.0, servedQuantity: 42.3, leftoverQuantity: 2.7, wasteQuantity: 0.2, perDinerRate: 0.0525 },
      { dishName: 'Tomato Dal / Dal Tadka', category: 'Dal & Gravy', unit: 'L', preparedQuantity: 19.0, servedQuantity: 17.3, leftoverQuantity: 1.7, wasteQuantity: 0.2, perDinerRate: 0.0215 },
      { dishName: 'Andhra Chicken Curry', category: 'Curry / Protein', unit: 'kg', preparedQuantity: 32.5, servedQuantity: 31.0, leftoverQuantity: 1.5, wasteQuantity: 0.0, perDinerRate: 0.0385 },
      { dishName: 'Mixed Vegetable Korma', category: 'Curry / Protein', unit: 'kg', preparedQuantity: 18.0, servedQuantity: 16.9, leftoverQuantity: 1.1, wasteQuantity: 0.1, perDinerRate: 0.0210 },
      { dishName: 'Fresh Set Curd', category: 'Dairy', unit: 'L', preparedQuantity: 13.0, servedQuantity: 12.1, leftoverQuantity: 0.9, wasteQuantity: 0.0, perDinerRate: 0.0150 },
    ],
  },
  {
    id: 'SRV-HYD-010',
    serviceDate: 'Day 12',
    dayOfWeek: 'Friday',
    mealType: 'Lunch',
    context: 'Standard',
    expectedDiners: 860,
    actualDiners: 835,
    attendanceRatio: 0.9709,
    dishes: [
      { dishName: 'Steamed Sona Masoori Rice', category: 'Staple', unit: 'kg', preparedQuantity: 47.0, servedQuantity: 43.9, leftoverQuantity: 3.1, wasteQuantity: 0.2, perDinerRate: 0.0526 },
      { dishName: 'Tomato Dal / Dal Tadka', category: 'Dal & Gravy', unit: 'L', preparedQuantity: 20.0, servedQuantity: 18.0, leftoverQuantity: 2.0, wasteQuantity: 0.2, perDinerRate: 0.0216 },
      { dishName: 'Andhra Chicken Curry', category: 'Curry / Protein', unit: 'kg', preparedQuantity: 34.0, servedQuantity: 32.2, leftoverQuantity: 1.8, wasteQuantity: 0.0, perDinerRate: 0.0386 },
      { dishName: 'Mixed Vegetable Korma', category: 'Curry / Protein', unit: 'kg', preparedQuantity: 19.0, servedQuantity: 17.5, leftoverQuantity: 1.5, wasteQuantity: 0.1, perDinerRate: 0.0210 },
      { dishName: 'Fresh Set Curd', category: 'Dairy', unit: 'L', preparedQuantity: 13.5, servedQuantity: 12.5, leftoverQuantity: 1.0, wasteQuantity: 0.0, perDinerRate: 0.0150 },
    ],
  },

  // WEEK 3 (Recent baseline days)
  {
    id: 'SRV-HYD-011',
    serviceDate: 'Day 15',
    dayOfWeek: 'Monday',
    mealType: 'Lunch',
    context: 'Standard',
    expectedDiners: 800,
    actualDiners: 775,
    attendanceRatio: 0.9688,
    dishes: [
      { dishName: 'Steamed Sona Masoori Rice', category: 'Staple', unit: 'kg', preparedQuantity: 43.5, servedQuantity: 40.8, leftoverQuantity: 2.7, wasteQuantity: 0.2, perDinerRate: 0.0526 },
      { dishName: 'Tomato Dal / Dal Tadka', category: 'Dal & Gravy', unit: 'L', preparedQuantity: 18.5, servedQuantity: 16.7, leftoverQuantity: 1.8, wasteQuantity: 0.2, perDinerRate: 0.0215 },
      { dishName: 'Andhra Chicken Curry', category: 'Curry / Protein', unit: 'kg', preparedQuantity: 31.0, servedQuantity: 29.8, leftoverQuantity: 1.2, wasteQuantity: 0.0, perDinerRate: 0.0385 },
      { dishName: 'Mixed Vegetable Korma', category: 'Curry / Protein', unit: 'kg', preparedQuantity: 17.5, servedQuantity: 16.3, leftoverQuantity: 1.2, wasteQuantity: 0.1, perDinerRate: 0.0210 },
      { dishName: 'Fresh Set Curd', category: 'Dairy', unit: 'L', preparedQuantity: 12.5, servedQuantity: 11.6, leftoverQuantity: 0.9, wasteQuantity: 0.0, perDinerRate: 0.0150 },
    ],
  },
  {
    id: 'SRV-HYD-012',
    serviceDate: 'Day 16',
    dayOfWeek: 'Tuesday',
    mealType: 'Lunch',
    context: 'Standard',
    expectedDiners: 815,
    actualDiners: 790,
    attendanceRatio: 0.9693,
    dishes: [
      { dishName: 'Steamed Sona Masoori Rice', category: 'Staple', unit: 'kg', preparedQuantity: 44.5, servedQuantity: 41.5, leftoverQuantity: 3.0, wasteQuantity: 0.2, perDinerRate: 0.0525 },
      { dishName: 'Tomato Dal / Dal Tadka', category: 'Dal & Gravy', unit: 'L', preparedQuantity: 19.0, servedQuantity: 17.0, leftoverQuantity: 2.0, wasteQuantity: 0.2, perDinerRate: 0.0215 },
      { dishName: 'Andhra Chicken Curry', category: 'Curry / Protein', unit: 'kg', preparedQuantity: 32.0, servedQuantity: 30.4, leftoverQuantity: 1.6, wasteQuantity: 0.0, perDinerRate: 0.0385 },
      { dishName: 'Mixed Vegetable Korma', category: 'Curry / Protein', unit: 'kg', preparedQuantity: 18.0, servedQuantity: 16.6, leftoverQuantity: 1.4, wasteQuantity: 0.1, perDinerRate: 0.0210 },
      { dishName: 'Fresh Set Curd', category: 'Dairy', unit: 'L', preparedQuantity: 13.0, servedQuantity: 11.9, leftoverQuantity: 1.1, wasteQuantity: 0.0, perDinerRate: 0.0151 },
    ],
  },
  {
    id: 'SRV-HYD-013',
    serviceDate: 'Day 17',
    dayOfWeek: 'Wednesday',
    mealType: 'Lunch',
    context: 'Standard',
    expectedDiners: 820,
    actualDiners: 795,
    attendanceRatio: 0.9695,
    dishes: [
      { dishName: 'Steamed Sona Masoori Rice', category: 'Staple', unit: 'kg', preparedQuantity: 44.8, servedQuantity: 41.8, leftoverQuantity: 3.0, wasteQuantity: 0.2, perDinerRate: 0.0526 },
      { dishName: 'Tomato Dal / Dal Tadka', category: 'Dal & Gravy', unit: 'L', preparedQuantity: 19.0, servedQuantity: 17.1, leftoverQuantity: 1.9, wasteQuantity: 0.2, perDinerRate: 0.0215 },
      { dishName: 'Andhra Chicken Curry', category: 'Curry / Protein', unit: 'kg', preparedQuantity: 32.5, servedQuantity: 30.6, leftoverQuantity: 1.9, wasteQuantity: 0.0, perDinerRate: 0.0385 },
      { dishName: 'Mixed Vegetable Korma', category: 'Curry / Protein', unit: 'kg', preparedQuantity: 18.0, servedQuantity: 16.7, leftoverQuantity: 1.3, wasteQuantity: 0.1, perDinerRate: 0.0210 },
      { dishName: 'Fresh Set Curd', category: 'Dairy', unit: 'L', preparedQuantity: 13.0, servedQuantity: 11.9, leftoverQuantity: 1.1, wasteQuantity: 0.0, perDinerRate: 0.0150 },
    ],
  },
  {
    id: 'SRV-HYD-014',
    serviceDate: 'Day 18',
    dayOfWeek: 'Thursday',
    mealType: 'Lunch',
    context: 'Standard',
    expectedDiners: 830,
    actualDiners: 805,
    attendanceRatio: 0.9699,
    dishes: [
      { dishName: 'Steamed Sona Masoori Rice', category: 'Staple', unit: 'kg', preparedQuantity: 45.0, servedQuantity: 42.3, leftoverQuantity: 2.7, wasteQuantity: 0.2, perDinerRate: 0.0525 },
      { dishName: 'Tomato Dal / Dal Tadka', category: 'Dal & Gravy', unit: 'L', preparedQuantity: 19.0, servedQuantity: 17.3, leftoverQuantity: 1.7, wasteQuantity: 0.2, perDinerRate: 0.0215 },
      { dishName: 'Andhra Chicken Curry', category: 'Curry / Protein', unit: 'kg', preparedQuantity: 32.5, servedQuantity: 31.0, leftoverQuantity: 1.5, wasteQuantity: 0.0, perDinerRate: 0.0385 },
      { dishName: 'Mixed Vegetable Korma', category: 'Curry / Protein', unit: 'kg', preparedQuantity: 18.0, servedQuantity: 16.9, leftoverQuantity: 1.1, wasteQuantity: 0.1, perDinerRate: 0.0210 },
      { dishName: 'Fresh Set Curd', category: 'Dairy', unit: 'L', preparedQuantity: 13.0, servedQuantity: 12.1, leftoverQuantity: 0.9, wasteQuantity: 0.0, perDinerRate: 0.0150 },
    ],
  },
  {
    id: 'SRV-HYD-015',
    serviceDate: 'Day 19',
    dayOfWeek: 'Friday',
    mealType: 'Lunch',
    context: 'Standard',
    expectedDiners: 850,
    actualDiners: 825,
    attendanceRatio: 0.9706,
    dishes: [
      { dishName: 'Steamed Sona Masoori Rice', category: 'Staple', unit: 'kg', preparedQuantity: 46.5, servedQuantity: 43.4, leftoverQuantity: 3.1, wasteQuantity: 0.2, perDinerRate: 0.0526 },
      { dishName: 'Tomato Dal / Dal Tadka', category: 'Dal & Gravy', unit: 'L', preparedQuantity: 19.5, servedQuantity: 17.7, leftoverQuantity: 1.8, wasteQuantity: 0.2, perDinerRate: 0.0215 },
      { dishName: 'Andhra Chicken Curry', category: 'Curry / Protein', unit: 'kg', preparedQuantity: 33.5, servedQuantity: 31.8, leftoverQuantity: 1.7, wasteQuantity: 0.0, perDinerRate: 0.0385 },
      { dishName: 'Mixed Vegetable Korma', category: 'Curry / Protein', unit: 'kg', preparedQuantity: 18.5, servedQuantity: 17.3, leftoverQuantity: 1.2, wasteQuantity: 0.1, perDinerRate: 0.0210 },
      { dishName: 'Fresh Set Curd', category: 'Dairy', unit: 'L', preparedQuantity: 13.5, servedQuantity: 12.4, leftoverQuantity: 1.1, wasteQuantity: 0.0, perDinerRate: 0.0150 },
    ],
  },

  // BREAKFAST BENCHMARKS
  {
    id: 'SRV-HYD-016',
    serviceDate: 'Day 20',
    dayOfWeek: 'Monday',
    mealType: 'Breakfast',
    context: 'Standard',
    expectedDiners: 700,
    actualDiners: 660,
    attendanceRatio: 0.9428,
    dishes: [
      { dishName: 'Steamed Rice Idli', category: 'Staple', unit: 'pieces', preparedQuantity: 1450, servedQuantity: 1386, leftoverQuantity: 64, wasteQuantity: 5, perDinerRate: 2.10 },
      { dishName: 'Crispy Medu Vada', category: 'Side', unit: 'pieces', preparedQuantity: 820, servedQuantity: 792, leftoverQuantity: 28, wasteQuantity: 0, perDinerRate: 1.20 },
      { dishName: 'Vegetable Sambar', category: 'Dal & Gravy', unit: 'L', preparedQuantity: 25.0, servedQuantity: 23.1, leftoverQuantity: 1.9, wasteQuantity: 0.2, perDinerRate: 0.0350 },
      { dishName: 'Fresh Coconut Chutney', category: 'Side', unit: 'kg', preparedQuantity: 16.0, servedQuantity: 14.5, leftoverQuantity: 1.5, wasteQuantity: 0.2, perDinerRate: 0.0220 },
    ],
  },
  {
    id: 'SRV-HYD-017',
    serviceDate: 'Day 21',
    dayOfWeek: 'Tuesday',
    mealType: 'Breakfast',
    context: 'Standard',
    expectedDiners: 720,
    actualDiners: 680,
    attendanceRatio: 0.9444,
    dishes: [
      { dishName: 'Steamed Rice Idli', category: 'Staple', unit: 'pieces', preparedQuantity: 1500, servedQuantity: 1428, leftoverQuantity: 72, wasteQuantity: 6, perDinerRate: 2.10 },
      { dishName: 'Crispy Medu Vada', category: 'Side', unit: 'pieces', preparedQuantity: 850, servedQuantity: 816, leftoverQuantity: 34, wasteQuantity: 0, perDinerRate: 1.20 },
      { dishName: 'Vegetable Sambar', category: 'Dal & Gravy', unit: 'L', preparedQuantity: 26.0, servedQuantity: 23.8, leftoverQuantity: 2.2, wasteQuantity: 0.2, perDinerRate: 0.0350 },
      { dishName: 'Fresh Coconut Chutney', category: 'Side', unit: 'kg', preparedQuantity: 16.5, servedQuantity: 15.0, leftoverQuantity: 1.5, wasteQuantity: 0.2, perDinerRate: 0.0221 },
    ],
  },

  // DINNER BENCHMARKS (Biryani & Roti)
  {
    id: 'SRV-HYD-018',
    serviceDate: 'Day 22',
    dayOfWeek: 'Wednesday',
    mealType: 'Dinner',
    context: 'Standard',
    expectedDiners: 750,
    actualDiners: 720,
    attendanceRatio: 0.9600,
    dishes: [
      { dishName: 'Hyderabadi Chicken Biryani', category: 'Staple', unit: 'kg', preparedQuantity: 57.0, servedQuantity: 54.0, leftoverQuantity: 3.0, wasteQuantity: 0.1, perDinerRate: 0.0750 },
      { dishName: 'Vegetable Dum Biryani', category: 'Staple', unit: 'kg', preparedQuantity: 27.0, servedQuantity: 25.2, leftoverQuantity: 1.8, wasteQuantity: 0.1, perDinerRate: 0.0350 },
      { dishName: 'Mirchi Ka Salan', category: 'Dal & Gravy', unit: 'L', preparedQuantity: 14.5, servedQuantity: 13.0, leftoverQuantity: 1.5, wasteQuantity: 0.2, perDinerRate: 0.0181 },
      { dishName: 'Mixed Onion Raitha', category: 'Dairy', unit: 'L', preparedQuantity: 17.0, servedQuantity: 15.8, leftoverQuantity: 1.2, wasteQuantity: 0.0, perDinerRate: 0.0219 },
    ],
  },
  {
    id: 'SRV-HYD-019',
    serviceDate: 'Day 23',
    dayOfWeek: 'Thursday',
    mealType: 'Dinner',
    context: 'Standard',
    expectedDiners: 760,
    actualDiners: 730,
    attendanceRatio: 0.9605,
    dishes: [
      { dishName: 'Hyderabadi Chicken Biryani', category: 'Staple', unit: 'kg', preparedQuantity: 58.0, servedQuantity: 54.8, leftoverQuantity: 3.2, wasteQuantity: 0.1, perDinerRate: 0.0751 },
      { dishName: 'Vegetable Dum Biryani', category: 'Staple', unit: 'kg', preparedQuantity: 27.5, servedQuantity: 25.6, leftoverQuantity: 1.9, wasteQuantity: 0.1, perDinerRate: 0.0351 },
      { dishName: 'Mirchi Ka Salan', category: 'Dal & Gravy', unit: 'L', preparedQuantity: 15.0, servedQuantity: 13.1, leftoverQuantity: 1.9, wasteQuantity: 0.2, perDinerRate: 0.0179 },
      { dishName: 'Mixed Onion Raitha', category: 'Dairy', unit: 'L', preparedQuantity: 17.5, servedQuantity: 16.1, leftoverQuantity: 1.4, wasteQuantity: 0.0, perDinerRate: 0.0221 },
    ],
  },
  {
    id: 'SRV-HYD-020',
    serviceDate: 'Day 24',
    dayOfWeek: 'Friday',
    mealType: 'Dinner',
    context: 'Standard',
    expectedDiners: 780,
    actualDiners: 750,
    attendanceRatio: 0.9615,
    dishes: [
      { dishName: 'Hyderabadi Chicken Biryani', category: 'Staple', unit: 'kg', preparedQuantity: 59.0, servedQuantity: 56.3, leftoverQuantity: 2.7, wasteQuantity: 0.1, perDinerRate: 0.0751 },
      { dishName: 'Vegetable Dum Biryani', category: 'Staple', unit: 'kg', preparedQuantity: 28.0, servedQuantity: 26.3, leftoverQuantity: 1.7, wasteQuantity: 0.1, perDinerRate: 0.0351 },
      { dishName: 'Mirchi Ka Salan', category: 'Dal & Gravy', unit: 'L', preparedQuantity: 15.5, servedQuantity: 13.5, leftoverQuantity: 2.0, wasteQuantity: 0.2, perDinerRate: 0.0180 },
      { dishName: 'Mixed Onion Raitha', category: 'Dairy', unit: 'L', preparedQuantity: 18.0, servedQuantity: 16.5, leftoverQuantity: 1.5, wasteQuantity: 0.0, perDinerRate: 0.0220 },
    ],
  },
  {
    id: 'SRV-HYD-021',
    serviceDate: 'Day 25 (Most Recent)',
    dayOfWeek: 'Saturday',
    mealType: 'Lunch',
    context: 'Weekend / Event',
    expectedDiners: 720,
    actualDiners: 690,
    attendanceRatio: 0.9583,
    dishes: [
      { dishName: 'Steamed Sona Masoori Rice', category: 'Staple', unit: 'kg', preparedQuantity: 39.0, servedQuantity: 36.3, leftoverQuantity: 2.7, wasteQuantity: 0.2, perDinerRate: 0.0526 },
      { dishName: 'Tomato Dal / Dal Tadka', category: 'Dal & Gravy', unit: 'L', preparedQuantity: 17.0, servedQuantity: 14.8, leftoverQuantity: 2.2, wasteQuantity: 0.2, perDinerRate: 0.0214 },
      { dishName: 'Andhra Chicken Curry', category: 'Curry / Protein', unit: 'kg', preparedQuantity: 28.5, servedQuantity: 26.6, leftoverQuantity: 1.9, wasteQuantity: 0.0, perDinerRate: 0.0386 },
      { dishName: 'Mixed Vegetable Korma', category: 'Curry / Protein', unit: 'kg', preparedQuantity: 16.0, servedQuantity: 14.5, leftoverQuantity: 1.5, wasteQuantity: 0.1, perDinerRate: 0.0210 },
      { dishName: 'Fresh Set Curd', category: 'Dairy', unit: 'L', preparedQuantity: 11.5, servedQuantity: 10.4, leftoverQuantity: 1.1, wasteQuantity: 0.0, perDinerRate: 0.0151 },
    ],
  },
  {
    id: 'SRV-HYD-022',
    serviceDate: 'Day 26',
    dayOfWeek: 'Sunday',
    mealType: 'Dinner',
    context: 'Weekend / Event',
    expectedDiners: 700,
    actualDiners: 665,
    attendanceRatio: 0.9500,
    dishes: [
      { dishName: 'Hyderabadi Chicken Biryani', category: 'Staple', unit: 'kg', preparedQuantity: 53.0, servedQuantity: 49.9, leftoverQuantity: 3.1, wasteQuantity: 0.1, perDinerRate: 0.0750 },
      { dishName: 'Vegetable Dum Biryani', category: 'Staple', unit: 'kg', preparedQuantity: 25.0, servedQuantity: 23.3, leftoverQuantity: 1.7, wasteQuantity: 0.1, perDinerRate: 0.0350 },
      { dishName: 'Mirchi Ka Salan', category: 'Dal & Gravy', unit: 'L', preparedQuantity: 14.0, servedQuantity: 12.0, leftoverQuantity: 2.0, wasteQuantity: 0.2, perDinerRate: 0.0180 },
      { dishName: 'Mixed Onion Raitha', category: 'Dairy', unit: 'L', preparedQuantity: 16.0, servedQuantity: 14.6, leftoverQuantity: 1.4, wasteQuantity: 0.0, perDinerRate: 0.0220 },
    ],
  },
  {
    id: 'SRV-HYD-023',
    serviceDate: 'Day 27',
    dayOfWeek: 'Monday',
    mealType: 'Breakfast',
    context: 'Standard',
    expectedDiners: 660,
    actualDiners: 635,
    attendanceRatio: 0.9621,
    dishes: [
      { dishName: 'Steamed Rice Idli', category: 'Staple', unit: 'pieces', preparedQuantity: 1400, servedQuantity: 1335, leftoverQuantity: 65, wasteQuantity: 5, perDinerRate: 2.10 },
      { dishName: 'Crispy Medu Vada', category: 'Side', unit: 'pieces', preparedQuantity: 800, servedQuantity: 762, leftoverQuantity: 38, wasteQuantity: 3, perDinerRate: 1.20 },
      { dishName: 'Vegetable Sambar', category: 'Dal & Gravy', unit: 'L', preparedQuantity: 24.0, servedQuantity: 22.2, leftoverQuantity: 1.8, wasteQuantity: 0.2, perDinerRate: 0.0350 },
      { dishName: 'Fresh Coconut Chutney', category: 'Side', unit: 'kg', preparedQuantity: 15.0, servedQuantity: 14.0, leftoverQuantity: 1.0, wasteQuantity: 0.1, perDinerRate: 0.0220 },
    ],
  },
  {
    id: 'SRV-HYD-024',
    serviceDate: 'Day 28',
    dayOfWeek: 'Monday',
    mealType: 'Lunch',
    context: 'Standard',
    expectedDiners: 810,
    actualDiners: 785,
    attendanceRatio: 0.9691,
    dishes: [
      { dishName: 'Steamed Sona Masoori Rice', category: 'Staple', unit: 'kg', preparedQuantity: 44.0, servedQuantity: 41.3, leftoverQuantity: 2.7, wasteQuantity: 0.2, perDinerRate: 0.0526 },
      { dishName: 'Tomato Dal / Dal Tadka', category: 'Dal & Gravy', unit: 'L', preparedQuantity: 18.5, servedQuantity: 16.9, leftoverQuantity: 1.6, wasteQuantity: 0.2, perDinerRate: 0.0215 },
      { dishName: 'Andhra Chicken Curry', category: 'Curry / Protein', unit: 'kg', preparedQuantity: 32.0, servedQuantity: 30.2, leftoverQuantity: 1.8, wasteQuantity: 0.0, perDinerRate: 0.0385 },
      { dishName: 'Mixed Vegetable Korma', category: 'Curry / Protein', unit: 'kg', preparedQuantity: 17.5, servedQuantity: 16.5, leftoverQuantity: 1.0, wasteQuantity: 0.1, perDinerRate: 0.0210 },
      { dishName: 'Fresh Set Curd', category: 'Dairy', unit: 'L', preparedQuantity: 12.5, servedQuantity: 11.8, leftoverQuantity: 0.7, wasteQuantity: 0.0, perDinerRate: 0.0150 },
    ],
  },
  {
    id: 'SRV-HYD-025',
    serviceDate: 'Day 29 (Most Recent)',
    dayOfWeek: 'Tuesday',
    mealType: 'Lunch',
    context: 'Standard',
    expectedDiners: 820,
    actualDiners: 795,
    attendanceRatio: 0.9695,
    dishes: [
      { dishName: 'Steamed Sona Masoori Rice', category: 'Staple', unit: 'kg', preparedQuantity: 44.5, servedQuantity: 41.8, leftoverQuantity: 2.7, wasteQuantity: 0.2, perDinerRate: 0.0526 },
      { dishName: 'Tomato Dal / Dal Tadka', category: 'Dal & Gravy', unit: 'L', preparedQuantity: 19.0, servedQuantity: 17.1, leftoverQuantity: 1.9, wasteQuantity: 0.2, perDinerRate: 0.0215 },
      { dishName: 'Andhra Chicken Curry', category: 'Curry / Protein', unit: 'kg', preparedQuantity: 32.5, servedQuantity: 30.6, leftoverQuantity: 1.9, wasteQuantity: 0.0, perDinerRate: 0.0385 },
      { dishName: 'Mixed Vegetable Korma', category: 'Curry / Protein', unit: 'kg', preparedQuantity: 18.0, servedQuantity: 16.7, leftoverQuantity: 1.3, wasteQuantity: 0.1, perDinerRate: 0.0210 },
    ],
  },
  {
    id: 'SRV-DGH-026',
    hotelId: 'HOTEL-DECCAN-HYD',
    serviceDate: 'Day 26',
    dayOfWeek: 'Wednesday',
    isWeekend: false,
    mealType: 'Dinner',
    serviceType: 'DINNER',
    context: 'Standard',
    specialEvent: false,
    expectedCustomers: 760,
    actualCustomers: 735,
    expectedDiners: 760,
    actualDiners: 735,
    attendanceRatio: 0.9671,
    foodPrepared: 110,
    foodServed: 104,
    foodRemaining: 6,
    foodWasted: 0.5,
    dishes: [
      { dishName: 'Hyderabadi Chicken Biryani', category: 'Staple', unit: 'kg', preparedQuantity: 58.0, servedQuantity: 55.2, leftoverQuantity: 2.8, wasteQuantity: 0.1, perDinerRate: 0.0751 },
      { dishName: 'Paneer Butter Masala', category: 'Curry / Protein', unit: 'kg', preparedQuantity: 26.0, servedQuantity: 24.3, leftoverQuantity: 1.7, wasteQuantity: 0.1, perDinerRate: 0.0331 },
      { dishName: 'Mirchi Ka Salan', category: 'Dal & Gravy', unit: 'L', preparedQuantity: 15.0, servedQuantity: 13.2, leftoverQuantity: 1.8, wasteQuantity: 0.2, perDinerRate: 0.0180 },
      { dishName: 'Mixed Onion Raitha', category: 'Dairy', unit: 'L', preparedQuantity: 17.0, servedQuantity: 15.8, leftoverQuantity: 1.2, wasteQuantity: 0.0, perDinerRate: 0.0215 },
    ],
  },
  {
    id: 'SRV-DGH-027',
    hotelId: 'HOTEL-DECCAN-HYD',
    serviceDate: 'Day 27',
    dayOfWeek: 'Thursday',
    isWeekend: false,
    mealType: 'Lunch',
    serviceType: 'LUNCH',
    context: 'Standard',
    specialEvent: false,
    expectedCustomers: 820,
    actualCustomers: 795,
    expectedDiners: 820,
    actualDiners: 795,
    attendanceRatio: 0.9695,
    foodPrepared: 122,
    foodServed: 116,
    foodRemaining: 6,
    foodWasted: 0.5,
    dishes: [
      { dishName: 'Steamed Sona Masoori Rice', category: 'Staple', unit: 'kg', preparedQuantity: 44.5, servedQuantity: 41.8, leftoverQuantity: 2.7, wasteQuantity: 0.2, perDinerRate: 0.0526 },
      { dishName: 'Tomato Dal / Dal Tadka', category: 'Dal & Gravy', unit: 'L', preparedQuantity: 19.0, servedQuantity: 17.1, leftoverQuantity: 1.9, wasteQuantity: 0.2, perDinerRate: 0.0215 },
      { dishName: 'Andhra Chicken Curry', category: 'Curry / Protein', unit: 'kg', preparedQuantity: 32.5, servedQuantity: 30.6, leftoverQuantity: 1.9, wasteQuantity: 0.0, perDinerRate: 0.0385 },
      { dishName: 'Mixed Vegetable Korma', category: 'Curry / Protein', unit: 'kg', preparedQuantity: 18.0, servedQuantity: 16.7, leftoverQuantity: 1.3, wasteQuantity: 0.1, perDinerRate: 0.0210 },
      { dishName: 'Fresh Set Curd', category: 'Dairy', unit: 'L', preparedQuantity: 13.0, servedQuantity: 11.9, leftoverQuantity: 1.1, wasteQuantity: 0.0, perDinerRate: 0.0150 },
    ],
  },
  {
    id: 'SRV-DGH-028',
    hotelId: 'HOTEL-DECCAN-HYD',
    serviceDate: 'Day 28',
    dayOfWeek: 'Friday',
    isWeekend: false,
    mealType: 'Dinner',
    serviceType: 'DINNER',
    context: 'Standard',
    specialEvent: false,
    expectedCustomers: 790,
    actualCustomers: 765,
    expectedDiners: 790,
    actualDiners: 765,
    attendanceRatio: 0.9684,
    foodPrepared: 118,
    foodServed: 112,
    foodRemaining: 6,
    foodWasted: 0.4,
    dishes: [
      { dishName: 'Hyderabadi Chicken Biryani', category: 'Staple', unit: 'kg', preparedQuantity: 60.0, servedQuantity: 57.5, leftoverQuantity: 2.5, wasteQuantity: 0.1, perDinerRate: 0.0752 },
      { dishName: 'Paneer Butter Masala', category: 'Curry / Protein', unit: 'kg', preparedQuantity: 28.0, servedQuantity: 26.2, leftoverQuantity: 1.8, wasteQuantity: 0.1, perDinerRate: 0.0342 },
      { dishName: 'Mirchi Ka Salan', category: 'Dal & Gravy', unit: 'L', preparedQuantity: 16.0, servedQuantity: 14.1, leftoverQuantity: 1.9, wasteQuantity: 0.2, perDinerRate: 0.0184 },
      { dishName: 'Mixed Onion Raitha', category: 'Dairy', unit: 'L', preparedQuantity: 18.0, servedQuantity: 16.8, leftoverQuantity: 1.2, wasteQuantity: 0.0, perDinerRate: 0.0220 },
    ],
  },
  {
    id: 'SRV-DGH-029',
    hotelId: 'HOTEL-DECCAN-HYD',
    serviceDate: 'Day 29',
    dayOfWeek: 'Saturday',
    isWeekend: true,
    mealType: 'Lunch',
    serviceType: 'LUNCH',
    context: 'Weekend / Event',
    specialEvent: true,
    eventName: 'Deccan Grand Saturday Banqueting Buffet',
    expectedCustomers: 860,
    actualCustomers: 845,
    expectedDiners: 860,
    actualDiners: 845,
    attendanceRatio: 0.9826,
    foodPrepared: 135,
    foodServed: 130,
    foodRemaining: 5,
    foodWasted: 0.4,
    dishes: [
      { dishName: 'Steamed Sona Masoori Rice', category: 'Staple', unit: 'kg', preparedQuantity: 47.0, servedQuantity: 44.5, leftoverQuantity: 2.5, wasteQuantity: 0.2, perDinerRate: 0.0527 },
      { dishName: 'Tomato Dal / Dal Tadka', category: 'Dal & Gravy', unit: 'L', preparedQuantity: 20.0, servedQuantity: 18.2, leftoverQuantity: 1.8, wasteQuantity: 0.2, perDinerRate: 0.0215 },
      { dishName: 'Andhra Chicken Curry', category: 'Curry / Protein', unit: 'kg', preparedQuantity: 35.0, servedQuantity: 32.5, leftoverQuantity: 2.5, wasteQuantity: 0.0, perDinerRate: 0.0385 },
      { dishName: 'Mixed Vegetable Korma', category: 'Curry / Protein', unit: 'kg', preparedQuantity: 19.0, servedQuantity: 17.8, leftoverQuantity: 1.2, wasteQuantity: 0.1, perDinerRate: 0.0211 },
      { dishName: 'Fresh Set Curd', category: 'Dairy', unit: 'L', preparedQuantity: 14.0, servedQuantity: 12.8, leftoverQuantity: 1.2, wasteQuantity: 0.0, perDinerRate: 0.0151 },
    ],
  },
  {
    id: 'SRV-DGH-030',
    hotelId: 'HOTEL-DECCAN-HYD',
    serviceDate: 'Day 30 (Most Recent)',
    dayOfWeek: 'Sunday',
    isWeekend: true,
    mealType: 'Dinner',
    serviceType: 'DINNER',
    context: 'Weekend / Event',
    specialEvent: true,
    eventName: 'Sunday Grand Banquet Feast',
    expectedCustomers: 820,
    actualCustomers: 805,
    expectedDiners: 820,
    actualDiners: 805,
    attendanceRatio: 0.9817,
    foodPrepared: 128,
    foodServed: 123,
    foodRemaining: 5,
    foodWasted: 0.3,
    dishes: [
      { dishName: 'Hyderabadi Chicken Biryani', category: 'Staple', unit: 'kg', preparedQuantity: 63.0, servedQuantity: 60.5, leftoverQuantity: 2.5, wasteQuantity: 0.1, perDinerRate: 0.0752 },
      { dishName: 'Paneer Butter Masala', category: 'Curry / Protein', unit: 'kg', preparedQuantity: 29.0, servedQuantity: 27.5, leftoverQuantity: 1.5, wasteQuantity: 0.1, perDinerRate: 0.0342 },
      { dishName: 'Mirchi Ka Salan', category: 'Dal & Gravy', unit: 'L', preparedQuantity: 16.5, servedQuantity: 14.8, leftoverQuantity: 1.7, wasteQuantity: 0.2, perDinerRate: 0.0184 },
      { dishName: 'Mixed Onion Raitha', category: 'Dairy', unit: 'L', preparedQuantity: 18.5, servedQuantity: 17.4, leftoverQuantity: 1.1, wasteQuantity: 0.0, perDinerRate: 0.0216 },
    ],
  },
];

/**
 * Historical Pattern Analysis Engine
 * Computes transparent, empirical metrics directly from the stored 30-day records.
 */
export function calculatePatternAnalysis(): PatternAnalysisOutput {
  const normalized = HISTORICAL_SERVICES.map(normalizeRecord);
  const total = normalized.length;
  const overallAvgDiners = normalized.reduce((s, r) => s + r.actualCustomers, 0) / (total || 1);

  // 1. Day of Week Averages (Mon - Sun)
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const dayOfWeekAverages = days.map((day) => {
    const matching = normalized.filter((r) => r.dayOfWeek === day);
    const count = matching.length;
    const avg = count > 0 ? matching.reduce((s, r) => s + r.actualCustomers, 0) / count : overallAvgDiners;
    const varianceVsMeanPct = Number((((avg - overallAvgDiners) / overallAvgDiners) * 100).toFixed(1));
    return {
      day,
      averageDiners: Math.round(avg),
      sampleSize: count,
      varianceVsMeanPct,
    };
  });

  // 2. Weekday vs Weekend Average
  const weekdays = normalized.filter((r) => !r.isWeekend);
  const weekends = normalized.filter((r) => r.isWeekend);
  const weekdayAverage = Math.round(weekdays.reduce((s, r) => s + r.actualCustomers, 0) / (weekdays.length || 1));
  const weekendAverage = Math.round(weekends.reduce((s, r) => s + r.actualCustomers, 0) / (weekends.length || 1));
  const weekdayVsWeekendPct = Number((((weekendAverage - weekdayAverage) / weekdayAverage) * 100).toFixed(1));

  // 3. Meal Comparison (Breakfast vs Lunch vs Dinner)
  const mealTypes: ServiceType[] = ['BREAKFAST', 'LUNCH', 'DINNER'];
  const mealAverages = mealTypes.map((meal) => {
    const matching = normalized.filter((r) => r.serviceType === meal);
    const count = matching.length;
    const avgDiners = count > 0 ? Math.round(matching.reduce((s, r) => s + r.actualCustomers, 0) / count) : 700;
    const typicalRate = meal === 'BREAKFAST' ? 0.08 : meal === 'LUNCH' ? 0.15 : 0.14;
    const typicalWastage = count > 0 ? Number(((matching.reduce((s, r) => s + r.foodWasted, 0) / matching.reduce((s, r) => s + r.foodPrepared, 0)) * 100).toFixed(1)) : 1.2;
    return {
      meal,
      averageDiners: avgDiners,
      averageConsumptionRateKg: typicalRate,
      typicalWastagePct: typicalWastage,
    };
  });

  // 4. Recent Trend (Last 7 days vs Previous 7 days)
  const sorted = [...normalized].reverse();
  const last7 = sorted.slice(0, 7);
  const prev7 = sorted.slice(7, 14);
  const avgLast7 = last7.reduce((s, r) => s + r.actualCustomers, 0) / (last7.length || 1);
  const avgPrev7 = prev7.reduce((s, r) => s + r.actualCustomers, 0) / (prev7.length || 1);
  const recent7DayTrendPct = Number((((avgLast7 - avgPrev7) / avgPrev7) * 100).toFixed(1));
  const recentTrendDirection = recent7DayTrendPct > 1.5 ? 'Upward' : recent7DayTrendPct < -1.5 ? 'Downward' : 'Stable';

  // 5. Special Event Multiplier
  const specialRecords = normalized.filter((r) => r.specialEvent);
  const specialAvgRatio = specialRecords.length > 0 
    ? specialRecords.reduce((s, r) => s + r.attendanceRatio, 0) / specialRecords.length 
    : 0.98;
  const standardRecords = normalized.filter((r) => !r.specialEvent && r.context === 'Standard');
  const standardAvgRatio = standardRecords.length > 0 
    ? standardRecords.reduce((s, r) => s + r.attendanceRatio, 0) / standardRecords.length 
    : 0.965;
  const specialEventMultiplier = Number((specialAvgRatio / standardAvgRatio).toFixed(3));

  // 6. Confidence Score
  const confidenceScore = total >= 30 ? 96 : total >= 15 ? 85 : 60;
  const confidenceLabel = confidenceScore >= 90 ? 'High' : confidenceScore >= 75 ? 'Medium' : 'Low';

  return {
    dayOfWeekAverages,
    weekdayAverage,
    weekendAverage,
    weekdayVsWeekendPct,
    mealAverages,
    recent7DayTrendPct,
    recentTrendDirection,
    specialEventMultiplier,
    confidenceScore,
    confidenceLabel,
    totalHistoricalRecords: total,
    dateRangeCovered: '30 Operating Days (Deccan Grand Hotel Archive)',
  };
}



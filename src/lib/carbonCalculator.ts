// Carbon Calculator Utility Functions
// Uses UK Government GHG Conversion Factors 2024

export interface EmissionFactors {
  // Scope 1
  naturalGasKwh: number;
  lpgLitres: number;
  heatingOilLitres: number;
  petrolLitres: number;
  dieselLitres: number;
  refrigerantKg: number;

  // Scope 2
  electricityKwh: number;
  electricityTDLosses: number;
  districtHeatKwh: number;

  // Scope 3
  domesticFlightKm: number;
  shortHaulFlightKm: number;
  longHaulFlightKm: number;
  railKm: number;
  carKm: number;
  busKm: number;
  wasteToLandfillTonnes: number;
  wasteRecyclingTonnes: number;
  waterSupplyCubicMetres: number;
  waterTreatmentCubicMetres: number;
  purchasedGoodsGbp: number;
}

// Default UK 2024 emission factors (kg CO2e per unit)
export const UK_EMISSION_FACTORS_2024: EmissionFactors = {
  // Scope 1: Fuels
  naturalGasKwh: 0.18293,
  lpgLitres: 1.55537,
  heatingOilLitres: 2.54031,
  petrolLitres: 2.19397,
  dieselLitres: 2.51233,
  refrigerantKg: 2088.0, // R410A average

  // Scope 2: Electricity
  electricityKwh: 0.20707,
  electricityTDLosses: 0.01879,
  districtHeatKwh: 0.16617,

  // Scope 3: Travel
  domesticFlightKm: 0.24587,
  shortHaulFlightKm: 0.15353,
  longHaulFlightKm: 0.19309,
  railKm: 0.03549,
  carKm: 0.17141,
  busKm: 0.10312,

  // Scope 3: Waste
  wasteToLandfillTonnes: 446.24,
  wasteRecyclingTonnes: 21.29,

  // Scope 3: Water
  waterSupplyCubicMetres: 0.149,
  waterTreatmentCubicMetres: 0.272,

  // Scope 3: Purchased goods (approximate)
  purchasedGoodsGbp: 0.00023,
};

export interface Scope1Inputs {
  naturalGasKwh: number;
  lpgLitres: number;
  heatingOilLitres: number;
  companyVehiclesPetrolLitres: number;
  companyVehiclesDieselLitres: number;
  companyVehiclesEvKwh: number;
  refrigerantsKg: number;
}

export interface Scope2Inputs {
  electricityKwh: number;
  districtHeatingKwh: number;
}

export interface Scope3Inputs {
  businessTravelAirDomesticKm: number;
  businessTravelAirShortHaulKm: number;
  businessTravelAirLongHaulKm: number;
  businessTravelRailKm: number;
  businessTravelCarKm: number;
  employeeCommutingCarKm: number;
  employeeCommutingBusKm: number;
  employeeCommutingRailKm: number;
  wasteGeneralTonnes: number;
  wasteRecyclingTonnes: number;
  waterCubicMetres: number;
  purchasedGoodsGbp: number;
}

export interface EmissionInputs {
  scope1: Scope1Inputs;
  scope2: Scope2Inputs;
  scope3: Scope3Inputs;
  periodStart: Date;
  periodEnd: Date;
  employeesCount: number;
  floorAreaSqm?: number;
}

export interface CarbonFootprint {
  scope1TotalKgCo2e: number;
  scope2TotalKgCo2e: number;
  scope3TotalKgCo2e: number;
  totalKgCo2e: number;
  totalTonnesCo2e: number;
  kgCo2ePerEmployee: number;
  kgCo2ePerSqm: number | null;

  // Detailed breakdown
  breakdown: {
    scope1: {
      naturalGas: number;
      lpg: number;
      heatingOil: number;
      vehiclesPetrol: number;
      vehiclesDiesel: number;
      vehiclesEv: number;
      refrigerants: number;
    };
    scope2: {
      electricity: number;
      districtHeating: number;
    };
    scope3: {
      businessTravelAir: number;
      businessTravelRail: number;
      businessTravelCar: number;
      employeeCommuting: number;
      waste: number;
      water: number;
      purchasedGoods: number;
    };
  };
}

export interface SectorBenchmark {
  businessType: string;
  employeeRange: string;
  avgKgCo2ePerEmployee: number;
  goodThresholdKg: number;
  averageThresholdKg: number;
}

export type ScoreCategory = 'good' | 'average' | 'needs_improvement';

/**
 * Calculate total carbon footprint from emission inputs
 */
export function calculateEmissions(
  inputs: EmissionInputs,
  factors: EmissionFactors = UK_EMISSION_FACTORS_2024
): CarbonFootprint {
  // Scope 1 calculations
  const scope1 = {
    naturalGas: inputs.scope1.naturalGasKwh * factors.naturalGasKwh,
    lpg: inputs.scope1.lpgLitres * factors.lpgLitres,
    heatingOil: inputs.scope1.heatingOilLitres * factors.heatingOilLitres,
    vehiclesPetrol: inputs.scope1.companyVehiclesPetrolLitres * factors.petrolLitres,
    vehiclesDiesel: inputs.scope1.companyVehiclesDieselLitres * factors.dieselLitres,
    vehiclesEv: inputs.scope1.companyVehiclesEvKwh * factors.electricityKwh, // EV charging is effectively scope 2
    refrigerants: inputs.scope1.refrigerantsKg * factors.refrigerantKg,
  };

  const scope1Total =
    scope1.naturalGas +
    scope1.lpg +
    scope1.heatingOil +
    scope1.vehiclesPetrol +
    scope1.vehiclesDiesel +
    scope1.vehiclesEv +
    scope1.refrigerants;

  // Scope 2 calculations
  const scope2 = {
    electricity: inputs.scope2.electricityKwh * (factors.electricityKwh + factors.electricityTDLosses),
    districtHeating: inputs.scope2.districtHeatingKwh * factors.districtHeatKwh,
  };

  const scope2Total = scope2.electricity + scope2.districtHeating;

  // Scope 3 calculations
  const businessTravelAir =
    inputs.scope3.businessTravelAirDomesticKm * factors.domesticFlightKm +
    inputs.scope3.businessTravelAirShortHaulKm * factors.shortHaulFlightKm +
    inputs.scope3.businessTravelAirLongHaulKm * factors.longHaulFlightKm;

  const businessTravelRail = inputs.scope3.businessTravelRailKm * factors.railKm;
  const businessTravelCar = inputs.scope3.businessTravelCarKm * factors.carKm;

  const employeeCommuting =
    inputs.scope3.employeeCommutingCarKm * factors.carKm +
    inputs.scope3.employeeCommutingBusKm * factors.busKm +
    inputs.scope3.employeeCommutingRailKm * factors.railKm;

  const waste =
    inputs.scope3.wasteGeneralTonnes * factors.wasteToLandfillTonnes +
    inputs.scope3.wasteRecyclingTonnes * factors.wasteRecyclingTonnes;

  const water =
    inputs.scope3.waterCubicMetres * (factors.waterSupplyCubicMetres + factors.waterTreatmentCubicMetres);

  const purchasedGoods = inputs.scope3.purchasedGoodsGbp * factors.purchasedGoodsGbp;

  const scope3 = {
    businessTravelAir,
    businessTravelRail,
    businessTravelCar,
    employeeCommuting,
    waste,
    water,
    purchasedGoods,
  };

  const scope3Total =
    businessTravelAir +
    businessTravelRail +
    businessTravelCar +
    employeeCommuting +
    waste +
    water +
    purchasedGoods;

  // Totals
  const totalKgCo2e = scope1Total + scope2Total + scope3Total;
  const totalTonnesCo2e = totalKgCo2e / 1000;

  // Per-unit metrics
  const kgCo2ePerEmployee = inputs.employeesCount > 0 ? totalKgCo2e / inputs.employeesCount : 0;
  const kgCo2ePerSqm = inputs.floorAreaSqm && inputs.floorAreaSqm > 0 ? totalKgCo2e / inputs.floorAreaSqm : null;

  return {
    scope1TotalKgCo2e: scope1Total,
    scope2TotalKgCo2e: scope2Total,
    scope3TotalKgCo2e: scope3Total,
    totalKgCo2e,
    totalTonnesCo2e,
    kgCo2ePerEmployee,
    kgCo2ePerSqm,
    breakdown: {
      scope1,
      scope2,
      scope3,
    },
  };
}

/**
 * Determine carbon score category based on benchmark comparison
 */
export function getCategoryFromBenchmark(
  kgCo2ePerEmployee: number,
  benchmark: SectorBenchmark
): ScoreCategory {
  if (kgCo2ePerEmployee <= benchmark.goodThresholdKg) {
    return 'good';
  } else if (kgCo2ePerEmployee <= benchmark.averageThresholdKg) {
    return 'average';
  }
  return 'needs_improvement';
}

/**
 * Calculate a percentage score (0-100) based on benchmark
 */
export function calculateScore(
  kgCo2ePerEmployee: number,
  benchmark: SectorBenchmark
): number {
  // Score based on how close to "good" threshold
  // 100 = at or below good threshold
  // 50 = at average threshold
  // 0 = at or above 2x average threshold

  if (kgCo2ePerEmployee <= benchmark.goodThresholdKg) {
    return 100;
  }

  if (kgCo2ePerEmployee <= benchmark.averageThresholdKg) {
    // Linear scale from 100 (good) to 50 (average)
    const range = benchmark.averageThresholdKg - benchmark.goodThresholdKg;
    const position = kgCo2ePerEmployee - benchmark.goodThresholdKg;
    return Math.round(100 - (position / range) * 50);
  }

  // Above average - scale from 50 to 0
  const maxBad = benchmark.averageThresholdKg * 2;
  if (kgCo2ePerEmployee >= maxBad) {
    return 0;
  }

  const range = maxBad - benchmark.averageThresholdKg;
  const position = kgCo2ePerEmployee - benchmark.averageThresholdKg;
  return Math.round(50 - (position / range) * 50);
}

/**
 * Get employee range string from count
 */
export function getEmployeeRange(count: number): string {
  if (count <= 9) return '1-9';
  if (count <= 49) return '10-49';
  if (count <= 249) return '50-249';
  return '250+';
}

/**
 * Format emissions for display
 */
export function formatEmissions(kgCo2e: number): string {
  if (kgCo2e >= 1000) {
    return `${(kgCo2e / 1000).toFixed(2)} tonnes CO₂e`;
  }
  return `${kgCo2e.toFixed(1)} kg CO₂e`;
}

/**
 * Get default empty inputs
 */
export function getDefaultInputs(): EmissionInputs {
  return {
    scope1: {
      naturalGasKwh: 0,
      lpgLitres: 0,
      heatingOilLitres: 0,
      companyVehiclesPetrolLitres: 0,
      companyVehiclesDieselLitres: 0,
      companyVehiclesEvKwh: 0,
      refrigerantsKg: 0,
    },
    scope2: {
      electricityKwh: 0,
      districtHeatingKwh: 0,
    },
    scope3: {
      businessTravelAirDomesticKm: 0,
      businessTravelAirShortHaulKm: 0,
      businessTravelAirLongHaulKm: 0,
      businessTravelRailKm: 0,
      businessTravelCarKm: 0,
      employeeCommutingCarKm: 0,
      employeeCommutingBusKm: 0,
      employeeCommutingRailKm: 0,
      wasteGeneralTonnes: 0,
      wasteRecyclingTonnes: 0,
      waterCubicMetres: 0,
      purchasedGoodsGbp: 0,
    },
    periodStart: new Date(new Date().getFullYear(), 0, 1),
    periodEnd: new Date(new Date().getFullYear(), 11, 31),
    employeesCount: 1,
    floorAreaSqm: undefined,
  };
}

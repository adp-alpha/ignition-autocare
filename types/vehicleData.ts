export interface VehicleData {
  RequestInformation: RequestInformation;
  ResponseInformation: ResponseInformation;
  BillingInformation: BillingInformation;
  Results: Results;
}

export interface RequestInformation {
  PackageName: string;
  SearchTerm: string;
  SearchType: string;
  RequestIp: string;
}

export interface ResponseInformation {
  StatusCode: number;
  StatusMessage: string;
  IsSuccessStatusCode: boolean;
  QueryTimeMs: number;
  ResponseId: string;
}

export interface BillingInformation {
  BillingTransactionId: string;
  AccountType: number;
  AccountBalance: number | null;
  TransactionCost: number | null;
  BillingResult: number;
  BillingResultMessage: string;
  RefundAmount: number | null;
  RefundResult: number | null;
  RefundResultMessage: string | null;
}

export interface Results {
  VehicleCodes: VehicleCodes;
  VehicleDetails: VehicleDetails;
  ModelDetails: ModelDetails;
}

export interface VehicleCodes {
  Uvc: string;
}

export interface VehicleDetails {
  VehicleIdentification: VehicleIdentification;
  VehicleStatus: VehicleStatus;
  VehicleHistory: VehicleHistory;
  DvlaTechnicalDetails: DvlaTechnicalDetails;
  StatusCode: number;
  StatusMessage: string;
  DocumentVersion: number;
}

export interface VehicleIdentification {
  Vrm: string;
  Vin: string;
  VinLast5: string;
  DvlaMake: string;
  DvlaModel: string;
  DvlaWheelPlan: string;
  DateFirstRegisteredInUk: string;
  DateFirstRegistered: string;
  DateOfManufacture: string;
  YearOfManufacture: number;
  VehicleUsedBeforeFirstRegistration: boolean;
  EngineNumber: string;
  PreviousVrmNi: string;
  DvlaBodyType: string;
  DvlaFuelType: string;
}

export interface VehicleStatus {
  IsImported: boolean;
  IsImportedFromNi: boolean;
  IsImportedFromOutsideEu: boolean;
  DateImported: string | null;
  CertificateOfDestructionIssued: boolean;
  IsExported: boolean;
  DateExported: string | null;
  IsScrapped: boolean;
  IsUnscrapped: boolean;
  DateScrapped: string | null;
  DvlaCherishedTransferMarker: boolean | null;
  VehicleExciseDutyDetails: VehicleExciseDutyDetails;
}

export interface VehicleExciseDutyDetails {
  DvlaCo2: number | null;
  DvlaCo2Band: string | null;
  DvlaBand: string | null;
  VedRate: VedRate;
}

export interface VedRate {
  FirstYear: SixTwelveMonthRate | null;
  PremiumVehicle: SixTwelveMonthRate | null;
  Standard: SixTwelveMonthRate | null;
}

export interface SixTwelveMonthRate {
  SixMonths: number | null;
  TwelveMonths: number | null;
}

export interface VehicleHistory {
  ColourDetails: ColourDetails;
  KeeperChangeList: KeeperChange[];
  PlateChangeList: PlateChange[];
V5cCertificateList: V5cCertificate[];
}

export interface ColourDetails {
  CurrentColour: string;
  NumberOfColourChanges: number | null;
  OriginalColour: string;
  PreviousColour: string | null;
  LatestColourChangeDate: string | null;
}

export interface KeeperChange {
  NumberOfPreviousKeepers: number | null;
  KeeperStartDate: string | null;
eviousKeeperDisposalDate: string | null;
}

export interface PlateChange {
  CurrentVrm: string;
  TransferType: string;
  DateOfReceipt: string;
  PreviousVrm: string;
  DateOfTransaction: string;
}

export interface V5cCertificate {
  IssueDate: string;
}

export interface DvlaTechnicalDetails {
  NumberOfSeats: number | null;
  EngineCapacityCc: number | null;
  GrossWeightKg: number | null;
  MaxNetPowerKw: number | null;
  MassInServiceKg: number | null;
  PowerToWeightRatio: number | null;
  MaxPermissibleBrakedTrailerMassKg: number | null;
  MaxPermissibleUnbrakedTrailerMassKg: number | null;
}

export interface ModelDetails {
  ModelIdentification: ModelIdentification;
  ModelClassification: ModelClassification;
  AdditionalInformation: AdditionalInformation;
  BodyDetails: BodyDetails;
  Dimensions: Dimensions;
  Weights: Weights;
  Powertrain: Powertrain;
  Safety: Safety;
  Emissions: Emissions;
  Performance: Performance;
  StatusCode: number;
  StatusMessage: string;
  DocumentVersion: number;
  GeneratedAt: string;
}

export interface ModelIdentification {
  Make: string;
  Range: string;
  Model: string;
  ModelVariant: string;
  Series: string;
  Mark: number;
  StartDate: string;
  EndDate: string;
  CountryOfOrigin: string;
  VariantCode: number;
}

export interface ModelClassification {
  TypeApprovalCategory: string;
  MarketSectorCode: string;
  VehicleClass: string;
  TaxationClass: string;
}

export interface AdditionalInformation {
  VehicleWarrantyInformation: VehicleWarrantyInformation;
  SubscriptionOptionList: any[];
  Software: Software;
}

export interface VehicleWarrantyInformation {
  ManufacturerWarrantyMiles: number | null;
  ManufacturerWarrantyMonths: number | null;
}

export interface Software {
  SupportsOverTheAirSoftwareUpdate: boolean | null;
}

export interface BodyDetails {
  BodyShape: string | null;
  BodyStyle: string;
  CabType: string | null;
  PlatformName: string | null;
  PlatformIsSharedAcrossModels: boolean | null;
  WheelbaseType: string;
  NumberOfAxles: number;
  NumberOfDoors: number;
  NumberOfSeats: number;
  PayloadVolumeLitres: number | null;
  FuelTankCapacityLitres: number;
}

export interface Dimensions {
  HeightMm: number;
  LengthMm: number;
  WidthMm: number;
  WheelbaseLengthMm: number;
  InternalLoadLengthMm: number | null;
}

export interface Weights {
  KerbWeightKg: number;
  GrossTrainWeightKg: number;
  UnladenWeightKg: number | null;
  PayloadWeightKg: number | null;
  GrossVehicleWeightKg: number;
  GrossCombinedWeightKg: number;
}

export interface Powertrain {
  PowertrainType: string;
  FuelType: string;
  IceDetails: IceDetails | null;
  EvDetails: any | null;
  Transmission: Transmission;
}

export interface IceDetails {
  EngineFamily: string | null;
  EngineLocation: string;
  EngineDescription: string;
  EngineManufacturer: string;
  FuelDelivery: string | null;
  Aspiration: string;
  CylinderArrangement: string;
  NumberOfCylinders: number;
  BoreMm: number;
  StrokeMm: number;
  ValveGear: string;
  ValvesPerCylinder: number;
  EngineCapacityCc: number;
  EngineCapacityLitres: number;
}

export interface Transmission {
  TransmissionType: string;
  NumberOfGears: number;
  DriveType: string;
  DrivingAxle: string;
}

export interface Safety {
  EuroNcap: EuroNcap;
}

export interface EuroNcap {
  NcapStarRating: number;
  NcapChildPercent: number;
  NcapAdultPercent: number;
  NcapPedestrianPercent: number;
  NcapSafetyAssistPercent: number;
}

export interface Emissions {
  EuroStatus: string;
  ManufacturerCo2: number;
  SoundLevels: SoundLevels;
}

export interface SoundLevels {
  StationaryDb: number;
  EngineSpeedRpm: number;
  DriveByDb: number;
}

export interface Performance {
  DragCoefficient: number | null;
  Torque: Torque;
  Power: Power;
  Statistics: Statistics;
  FuelEconomy: FuelEconomy;
}

export interface Torque {
  Nm: number;
  LbFt: number;
  Rpm: number;
}

export interface Power {
  Bhp: number;
  Ps: number;
  Kw: number;
  Rpm: number;
}

export interface Statistics {
  ZeroToSixtyMph: number | null;
  ZeroToOneHundredKph: number;
  MaxSpeedKph: number;
  MaxSpeedMph: number;
}

export interface FuelEconomy {
  UrbanColdMpg: number | null;
  ExtraUrbanMpg: number | null;
  CombinedMpg: number;
  UrbanColdL100Km: number | null;
  ExtraUrbanL100Km: number | null;
  CombinedL100Km: number;
}

export interface MotHistoryData {
  RequestInformation: RequestInformation;
  ResponseInformation: ResponseInformation;
  BillingInformation: BillingInformation;
  Results: MotResults;
}

export interface MotResults {
  VehicleCodes: VehicleCodes;
  MotHistoryDetails: MotHistoryDetails;
}

export interface MotHistoryDetails {
  Vrm: string;
  UpdateTimeStamp: string | null;
  LatestTestDate: string | null;
  MotDueDate: string | null;
  DaysSinceLastMot: number | null;
  FirstUsedDate: string | null;
  Make: string;
  Model: string;
  FuelType: string;
  Colour: string;
  MotTestDetailsList: MotTestDetail[];
  StatusCode: number;
  StatusMessage: string;
  DocumentVersion: number;
}

export interface MotTestDetail {
  TestDate: string | null;
  TestPassed: boolean;
  ExpiryDate: string | null;
  OdometerReading: string;
  OdometerUnit: string;
  OdometerResultType: string;
  TestNumber: string;
  DaysSinceLastTest: number | null;
  DaysSinceLastPass: number | null;
  DaysOutOfMot: number | null;
  IsRetest: boolean;
  ExtensionInformation: ExtensionInformation | null;
  AnnotationList: Annotation[];
}

export interface ExtensionInformation {
  HasExtensionPeriod: boolean;
  ExtensionPeriodReason: string | null;
  ExtensionPeriodAdditionalDays: number | null;
  ExtensionPeriodOriginalDueDate: string | null;
}

export interface Annotation {
  Type: string;
  Text: string;
  IsDangerous: boolean | null;
}

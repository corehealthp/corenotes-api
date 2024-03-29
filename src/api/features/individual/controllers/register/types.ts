export interface registerIndividualRequestBodyType {
  role?: "individual";
  firstname?: string;
  middlename?: string;
  lastname?: string;
  nickname?: string;
  dob?: string;
  gender?: string;
  maritalStatus?: string;
  religion?: string;
  ssn?: string;
  weight?: string;
  medicaidNumber?: number;
  insurance?: string;
  insuranceNo?: number;
  medicareNo?: number;
  otherInsuranceNo?: number;

  activityLimitations: string;
  dischargePlan: string;
  expectedDurationOfService: string;
  hardOfHearing: string;
  medicallyFrail: string;
  oxygen: string;
  proneToFalling: string;
  shortnessOfBreath: string;
  seizureActivity: string;
  visionLoss: string;
  weigthBearingLimitation: string;
  incontinentSafety: string;
  daysOfService: string;
  expectedFrequency: string;

  codeAlert?: Array<string>;
  contact?: {
    name?: string;
    email?: string;
    phoneNumber?: string;
  };
  // NEW HEALTH INFORMATION
  compartment?: string;
  subCompartmentId?: string;
  services?: Array<{
    serviceId?: string;
    schedule: {
      startDate: string;
      time: string;
      frequency: string;
      frequencyAttr: string | number;
    };
    staffRole: string;
    staffRoleStatus: string;
  }>;
  diet?: Array<string>;
  allergies?: {
    food?: Array<string>;
    med?: Array<string>;
    other?: Array<string>;
  };
}

export interface validateRegisterIndividualRequestBodyType {
  status: boolean;
  code: number;
  message: "SUCCESS" | string;
  requestBody: registerIndividualRequestBodyType;
}

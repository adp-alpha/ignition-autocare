{
  "openapi": "3.0.4",
  "info": {
    "title": "UK Vehicle Data Limited - VehicleDetails",
    "description": "Auto-Generated OpenAPI documentation for package name 'VehicleDetails'",
    "contact": {
      "name": "UK Vehicle Data Limited",
      "url": "https://www.ukvehicledata.co.uk/",
      "email": "help@ukvehicledata.co.uk"
    },
    "version": "1.0.8.0"
  },
  "servers": [
    {
      "url": "https://uk.api.vehicledataglobal.com",
      "description": "API Endpoint for UK Vehicle Data Limited"
    }
  ],
  "paths": {
    "/r2/lookup": {
      "get": {
        "tags": [
          "VehicleDetails"
        ],
        "summary": "Perform lookup against UK Vehicle Data Limited",
        "description": "Perform a lookup against UK Vehicle Data to retrieve back; VehicleCodes, VehicleDetails, ModelDetails.\nSearch using one of the following query parameters; Vrm, Vin, UkvdId, Uvc.",
        "operationId": "PerformLookup",
        "parameters": [
          {
            "name": "ApiKey",
            "in": "query",
            "description": "API Key to Authorize the Lookup",
            "required": true,
            "schema": {
              "type": "string",
              "format": "uuid"
            }
          },
          {
            "name": "PackageName",
            "in": "query",
            "description": "Package Name",
            "required": true,
            "schema": {
              "pattern": "^[a-zA-Z0-9]{0,80}$",
              "type": "string"
            }
          },
          {
            "name": "Vrm",
            "in": "query",
            "description": "The Vehicle Registration Mark",
            "schema": {
              "type": "string",
              "format": "^[A-Z]{2}[0-9]{2}\\s?[A-Z]{3}$"
            }
          },
          {
            "name": "Vin",
            "in": "query",
            "description": "The Vehicle Identification (Chassis) Number",
            "schema": {
              "type": "string",
              "format": "^[A-HJ-NPR-Z0-9]{20}$"
            }
          },
          {
            "name": "UkvdId",
            "in": "query",
            "description": "The UKVD Identification Number",
            "schema": {
              "type": "string",
              "format": "V-[a-zA-Z0-9]{6}"
            }
          },
          {
            "name": "Uvc",
            "in": "query",
            "description": "The UKVD Vehicle Code",
            "schema": {
              "type": "string",
              "format": "M-[a-zA-Z0-9]{5}"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Lookup Response",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/ResponseWithResults"
                }
              }
            }
          },
          "401": {
            "description": "Unauthorized",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/ResponseWithoutResults"
                }
              }
            }
          },
          "429": {
            "description": "Rate Limit Exceeded",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/ResponseWithoutResults"
                }
              }
            }
          },
          "500": {
            "description": "Internal Server Error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/ResponseWithoutResults"
                }
              }
            }
          }
        }
      }
    }
  },
  "components": {
    "schemas": {
      "ResponseWithResults": {
        "type": "object",
        "properties": {
          "RequestInformation": {
            "type": "object",
            "properties": {
              "PackageName": {
                "title": "PackageName",
                "type": "string",
                "description": "The name of the package that was used to make the request.",
                "nullable": true
              },
              "SearchTerm": {
                "title": "SearchTerm",
                "type": "string",
                "description": "The value used to do the look up.",
                "nullable": true
              },
              "SearchType": {
                "title": "SearchType",
                "type": "string",
                "description": "Which data item that is being looked up.",
                "nullable": true
              },
              "RequestIp": {
                "title": "RequestIp",
                "type": "string",
                "description": "The IP address where the request was made from.",
                "nullable": true
              }
            }
          },
          "ResponseInformation": {
            "type": "object",
            "properties": {
              "StatusCode": {
                "title": "StatusCode",
                "enum": [
                  0,
                  1,
                  2,
                  3,
                  4,
                  5,
                  6,
                  7,
                  8,
                  9,
                  10,
                  11,
                  12,
                  13,
                  14,
                  15,
                  17,
                  18,
                  19,
                  20,
                  21,
                  22,
                  23,
                  24,
                  25,
                  26,
                  27,
                  28,
                  29
                ],
                "type": "integer",
                "description": "The status of the response\n0 = Success\n1 = SuccessWithResultsBlockWarnings\n2 = NoResultsFound\n3 = BillingFailure\n4 = FilterIpFailure\n5 = FilterCustomFailure\n6 = SandboxValidationFailure\n7 = UnknownApiKey\n8 = UnknownPackage\n9 = UnknownSearchType\n10 = ThirdPartyFailure\n11 = FailedPackageRule\n12 = BadlyFormedUrl\n13 = InvalidSearchTerm\n14 = NoSearchTermFound\n15 = MultipleSearchTermsFound\n17 = InformationTemporarilyUnavailable\n18 = PackageRestrictedFromApiKey\n19 = ApiKeyReachedConcurrentLimit\n20 = ApiKeyReachedDailyLimit\n21 = PlateInRetentionLastVehicleReturned\n22 = ApiKeyInvalidForPackage\n23 = AccountNotActive\n24 = DataIntegrityWarning\n25 = NoDvlaRegistrationDataAvailable\n26 = NoMatchFound\n27 = PackageReachedConcurrentLimit\n28 = PackageReachedDailyLimit\n29 = UnknownRevision",
                "format": "int32",
                "example": 0
              },
              "StatusMessage": {
                "title": "StatusMessage",
                "type": "string",
                "description": "The status of the response as text",
                "nullable": true
              },
              "IsSuccessStatusCode": {
                "title": "IsSuccessStatusCode",
                "type": "boolean",
                "description": "This returns whether the status of the response indicates that the request was successful."
              },
              "QueryTimeMs": {
                "title": "QueryTimeMs",
                "type": "integer",
                "description": "This is the amount of time the query took to execute in milliseconds",
                "format": "int64"
              },
              "ResponseId": {
                "title": "ResponseId",
                "type": "string",
                "description": "This is the unique identifier of the report. Use this when referring to any issues with the results with support.",
                "format": "uuid"
              }
            }
          },
          "BillingInformation": {
            "type": "object",
            "properties": {
              "BillingTransactionId": {
                "title": "BillingTransactionId",
                "type": "string",
                "description": "This is the unique reference to the billing transaction for this lookup. If missing this transaction did not require any billing to take place.",
                "format": "uuid",
                "nullable": true
              },
              "AccountType": {
                "title": "AccountType",
                "enum": [
                  0,
                  1,
                  2,
                  3,
                  4,
                  5,
                  6
                ],
                "type": "integer",
                "description": "This is the current type of account that defines how the account is billed.\n0 = Trial\n1 = PayGo\n2 = Subscription",
                "format": "int32",
                "example": 0
              },
              "AccountBalance": {
                "title": "AccountBalance",
                "type": "number",
                "description": "The current balance of the account if this is a pay as a go account.",
                "format": "double",
                "nullable": true
              },
              "TransactionCost": {
                "title": "TransactionCost",
                "type": "number",
                "description": "The total cost of the transaction if the transaction required billing.",
                "format": "double",
                "nullable": true
              },
              "BillingResult": {
                "title": "BillingResult",
                "enum": [
                  0,
                  1,
                  2,
                  3,
                  4,
                  50
                ],
                "type": "integer",
                "description": "Whether the account was billed\n0 = Success\n1 = InsufficientFunds\n2 = OverageCapMet\n3 = BillingAccountNotFound\n4 = SandboxKey\n50 = Deferred",
                "format": "int32",
                "example": 0
              },
              "BillingResultMessage": {
                "title": "BillingResultMessage",
                "type": "string",
                "description": "Whether the account was billed in text format",
                "nullable": true
              },
              "RefundAmount": {
                "title": "RefundAmount",
                "type": "number",
                "description": "The amount that was required to be refunded depending on what package data was able to be returned and how the package was set up.",
                "format": "double",
                "nullable": true
              },
              "RefundResult": {
                "title": "RefundResult",
                "enum": [
                  0,
                  50
                ],
                "type": "integer",
                "description": "Whether the transaction had a refund\n0 = Success\n50 = Deferred",
                "format": "int32",
                "nullable": true,
                "example": 0
              },
              "RefundResultMessage": {
                "title": "RefundResultMessage",
                "type": "string",
                "description": "Whether the transaction had a refund in text format",
                "nullable": true
              }
            }
          },
          "Results": {
            "type": "object",
            "properties": {
              "VehicleCodes": {
                "type": "object",
                "properties": {
                  "Uvc": {
                    "title": "Uvc",
                    "type": "string",
                    "description": "Universal Vehicle Code. UK Vehicle Data internal vehicle model code. Code is unique to each vehicle model.",
                    "nullable": true
                  }
                }
              },
              "VehicleDetails": {
                "type": "object",
                "properties": {
                  "VehicleIdentification": {
                    "type": "object",
                    "properties": {
                      "Vrm": {
                        "title": "Vrm",
                        "type": "string",
                        "description": "The Vehicle Registration Mark (VRM).",
                        "nullable": true
                      },
                      "Vin": {
                        "title": "Vin",
                        "type": "string",
                        "description": "The Vehicle Identification Number (VIN) - sometimes referred to as the Chassis Number.",
                        "nullable": true
                      },
                      "VinLast5": {
                        "title": "VinLast5",
                        "type": "string",
                        "description": "The last 5 digits of the Vehicle Identification Number (VIN).",
                        "nullable": true
                      },
                      "DvlaMake": {
                        "title": "DvlaMake",
                        "type": "string",
                        "description": "Vehicle make (eg: Ford, Volkswagen, Audi)",
                        "nullable": true
                      },
                      "DvlaModel": {
                        "title": "DvlaModel",
                        "type": "string",
                        "description": "Vehicle model (eg: Galaxy, Sharan, R8)",
                        "nullable": true
                      },
                      "DvlaWheelPlan": {
                        "title": "DvlaWheelPlan",
                        "type": "string",
                        "description": "Vehicle wheel plan identifier (eg: 2 AXLE RIGID BODY)",
                        "nullable": true,
                        "example": "2 AXLE"
                      },
                      "DateFirstRegisteredInUk": {
                        "title": "DateFirstRegisteredInUk",
                        "type": "string",
                        "description": "Date/time the vehicle was first registered in the UK.",
                        "format": "date-time",
                        "nullable": true
                      },
                      "DateFirstRegistered": {
                        "title": "DateFirstRegistered",
                        "type": "string",
                        "description": "Date/time the vehicle was first registered.",
                        "format": "date-time",
                        "nullable": true
                      },
                      "DateOfManufacture": {
                        "title": "DateOfManufacture",
                        "type": "string",
                        "description": "Date/time the vehicle was manufactured.",
                        "format": "date-time",
                        "nullable": true
                      },
                      "YearOfManufacture": {
                        "title": "YearOfManufacture",
                        "type": "integer",
                        "description": "Year the vehicle was manufactured.",
                        "format": "int32",
                        "nullable": true
                      },
                      "VehicleUsedBeforeFirstRegistration": {
                        "title": "VehicleUsedBeforeFirstRegistration",
                        "type": "boolean",
                        "description": "Indicates whether or not the vehicle used before first registration."
                      },
                      "EngineNumber": {
                        "title": "EngineNumber",
                        "type": "string",
                        "description": "The vehicle's Engine Number.",
                        "nullable": true
                      },
                      "PreviousVrmNi": {
                        "title": "PreviousVrmNi",
                        "type": "string",
                        "description": "The vehicle's Northern Ireland plate - if the vehicle previously had a Northern Ireland VRM.",
                        "nullable": true
                      },
                      "DvlaBodyType": {
                        "title": "DvlaBodyType",
                        "type": "string",
                        "description": "The DVLA Body Type.",
                        "nullable": true
                      },
                      "DvlaFuelType": {
                        "title": "DvlaFuelType",
                        "type": "string",
                        "description": "The DVLA Fuel Type.",
                        "nullable": true
                      }
                    },
                    "nullable": true
                  },
                  "VehicleStatus": {
                    "type": "object",
                    "properties": {
                      "IsImported": {
                        "title": "IsImported",
                        "type": "boolean",
                        "description": "Indicates whether or not vehicle was imported from within the EU (European Union)."
                      },
                      "IsImportedFromNi": {
                        "title": "IsImportedFromNi",
                        "type": "boolean",
                        "description": "Indicates whether or not vehicle was imported from Northern Ireland."
                      },
                      "IsImportedFromOutsideEu": {
                        "title": "IsImportedFromOutsideEu",
                        "type": "boolean",
                        "description": "Indicates whether or not vehicle was imported from outside the EU (European Union)."
                      },
                      "DateImported": {
                        "title": "DateImported",
                        "type": "string",
                        "description": "Date/time the vehicle was imported.",
                        "format": "date-time",
                        "nullable": true
                      },
                      "CertificateOfDestructionIssued": {
                        "title": "CertificateOfDestructionIssued",
                        "type": "boolean",
                        "description": "Indicates whether or not a Certificate of Destruction been issued for this vehicle."
                      },
                      "IsExported": {
                        "title": "IsExported",
                        "type": "boolean",
                        "description": "Indicates whether or not the vehicle is recorded as having been exported."
                      },
                      "DateExported": {
                        "title": "DateExported",
                        "type": "string",
                        "description": "Date and time the vehicle was exported.",
                        "format": "date-time",
                        "nullable": true
                      },
                      "IsScrapped": {
                        "title": "IsScrapped",
                        "type": "boolean",
                        "description": "Indicates whether or not the vehicle been recorded as scrapped."
                      },
                      "IsUnscrapped": {
                        "title": "IsUnscrapped",
                        "type": "boolean",
                        "description": "Indicates whether or not the vehicle has been recorded as un-scrapped."
                      },
                      "DateScrapped": {
                        "title": "DateScrapped",
                        "type": "string",
                        "description": "Date and time the vehicle was recorded as scrapped.",
                        "format": "date-time",
                        "nullable": true
                      },
                      "DvlaCherishedTransferMarker": {
                        "title": "DvlaCherishedTransferMarker",
                        "type": "boolean",
                        "description": "Indicates whether or not the vehicle has been subject to cherished transfers, as disclosed by the DVLA",
                        "nullable": true
                      },
                      "VehicleExciseDutyDetails": {
                        "type": "object",
                        "properties": {
                          "DvlaCo2": {
                            "title": "DvlaCo2",
                            "type": "integer",
                            "description": "The CO2 value, unchecked direct from the DVLA.",
                            "format": "int32",
                            "nullable": true
                          },
                          "DvlaCo2Band": {
                            "title": "DvlaCo2Band",
                            "type": "string",
                            "description": "The CO2 band, unchecked direct from the DVLA.",
                            "nullable": true
                          },
                          "DvlaBand": {
                            "title": "DvlaBand",
                            "type": "string",
                            "description": "DVLA band details.",
                            "nullable": true
                          },
                          "VedRate": {
                            "type": "object",
                            "properties": {
                              "FirstYear": {
                                "type": "object",
                                "properties": {
                                  "SixMonths": {
                                    "title": "SixMonths",
                                    "type": "number",
                                    "description": "Vehicle road tax charge for 6 months.",
                                    "format": "double",
                                    "nullable": true
                                  },
                                  "TwelveMonths": {
                                    "title": "TwelveMonths",
                                    "type": "number",
                                    "description": "Vehicle road tax charge for 12 months.",
                                    "format": "double",
                                    "nullable": true
                                  }
                                },
                                "nullable": true
                              },
                              "PremiumVehicle": {
                                "type": "object",
                                "properties": {
                                  "SixMonths": {
                                    "title": "SixMonths",
                                    "type": "number",
                                    "description": "Vehicle road tax charge for 6 months.",
                                    "format": "double",
                                    "nullable": true
                                  },
                                  "TwelveMonths": {
                                    "title": "TwelveMonths",
                                    "type": "number",
                                    "description": "Vehicle road tax charge for 12 months.",
                                    "format": "double",
                                    "nullable": true
                                  }
                                },
                                "nullable": true
                              },
                              "Standard": {
                                "type": "object",
                                "properties": {
                                  "SixMonths": {
                                    "title": "SixMonths",
                                    "type": "number",
                                    "description": "Vehicle road tax charge for 6 months.",
                                    "format": "double",
                                    "nullable": true
                                  },
                                  "TwelveMonths": {
                                    "title": "TwelveMonths",
                                    "type": "number",
                                    "description": "Vehicle road tax charge for 12 months.",
                                    "format": "double",
                                    "nullable": true
                                  }
                                },
                                "nullable": true
                              }
                            },
                            "nullable": true
                          }
                        },
                        "nullable": true
                      }
                    },
                    "nullable": true
                  },
                  "VehicleHistory": {
                    "type": "object",
                    "properties": {
                      "ColourDetails": {
                        "type": "object",
                        "properties": {
                          "CurrentColour": {
                            "title": "CurrentColour",
                            "type": "string",
                            "description": "The vehicle's currently recorded colour.",
                            "nullable": true
                          },
                          "NumberOfColourChanges": {
                            "title": "NumberOfColourChanges",
                            "type": "integer",
                            "description": "Number of colour changes recorded for this vehicle.",
                            "format": "int32",
                            "nullable": true
                          },
                          "OriginalColour": {
                            "title": "OriginalColour",
                            "type": "string",
                            "description": "The vehicle's original colour.",
                            "nullable": true
                          },
                          "PreviousColour": {
                            "title": "PreviousColour",
                            "type": "string",
                            "description": "The vehicle's previous colour.",
                            "nullable": true
                          },
                          "LatestColourChangeDate": {
                            "title": "LatestColourChangeDate",
                            "type": "string",
                            "description": "The latest date when the vehicle's colour was recorded as having been changed.",
                            "format": "date-time",
                            "nullable": true
                          }
                        },
                        "nullable": true
                      },
                      "KeeperChangeList": {
                        "title": "KeeperChangeList",
                        "type": "array",
                        "items": {
                          "type": "object",
                          "properties": {
                            "NumberOfPreviousKeepers": {
                              "title": "NumberOfPreviousKeepers",
                              "type": "integer",
                              "description": "The number of previous keepers for this vehicle.",
                              "format": "int32",
                              "nullable": true
                            },
                            "KeeperStartDate": {
                              "title": "KeeperStartDate",
                              "type": "string",
                              "description": "Date when the current keeper started.",
                              "format": "date-time",
                              "nullable": true
                            },
                            "PreviousKeeperDisposalDate": {
                              "title": "PreviousKeeperDisposalDate",
                              "type": "string",
                              "description": "Date when the previous keeper disposed of the vehicle",
                              "format": "date-time",
                              "nullable": true
                            }
                          }
                        },
                        "description": "List of Keeper changes."
                      },
                      "PlateChangeList": {
                        "title": "PlateChangeList",
                        "type": "array",
                        "items": {
                          "type": "object",
                          "properties": {
                            "CurrentVrm": {
                              "title": "CurrentVrm",
                              "type": "string",
                              "description": "The vehicle's current VRM.",
                              "nullable": true
                            },
                            "TransferType": {
                              "title": "TransferType",
                              "type": "string",
                              "description": "The type of plate transfer.",
                              "nullable": true
                            },
                            "DateOfReceipt": {
                              "title": "DateOfReceipt",
                              "type": "string",
                              "description": "Date of receipt for the plate transfer.",
                              "format": "date-time",
                              "nullable": true
                            },
                            "PreviousVrm": {
                              "title": "PreviousVrm",
                              "type": "string",
                              "description": "The previous VRM, before the new (current VRM) was assigned.",
                              "nullable": true
                            },
                            "DateOfTransaction": {
                              "title": "DateOfTransaction",
                              "type": "string",
                              "description": "Date of the plate transfer transaction.",
                              "format": "date-time",
                              "nullable": true
                            }
                          }
                        },
                        "description": "List of registration plate changes."
                      },
                      "V5cCertificateList": {
                        "title": "V5cCertificateList",
                        "type": "array",
                        "items": {
                          "type": "object",
                          "properties": {
                            "IssueDate": {
                              "title": "IssueDate",
                              "type": "string",
                              "description": "Issue date of certificate.",
                              "format": "date-time"
                            }
                          }
                        },
                        "description": "A list of V5C Certificate issued dates."
                      }
                    },
                    "nullable": true
                  },
                  "DvlaTechnicalDetails": {
                    "type": "object",
                    "properties": {
                      "NumberOfSeats": {
                        "title": "NumberOfSeats",
                        "type": "integer",
                        "description": "Number of seats inside the vehicle, including the drivers seat",
                        "format": "int32",
                        "nullable": true
                      },
                      "EngineCapacityCc": {
                        "title": "EngineCapacityCc",
                        "type": "integer",
                        "description": "Engine Capacity as disclosed by the DVLA",
                        "format": "int32",
                        "nullable": true
                      },
                      "GrossWeightKg": {
                        "title": "GrossWeightKg",
                        "type": "integer",
                        "description": "Gross Vehicle Weight, as disclosed by the DVLA",
                        "format": "int32",
                        "nullable": true
                      },
                      "MaxNetPowerKw": {
                        "title": "MaxNetPowerKw",
                        "type": "integer",
                        "description": "Maximum Net Power of the vehicle, expressed in kW, as disclosed by the DVLA",
                        "format": "int32",
                        "nullable": true
                      },
                      "MassInServiceKg": {
                        "title": "MassInServiceKg",
                        "type": "integer",
                        "description": "Mass In Service, as disclosed by the DVLA",
                        "format": "int32",
                        "nullable": true
                      },
                      "PowerToWeightRatio": {
                        "title": "PowerToWeightRatio",
                        "type": "number",
                        "description": "Power to Weight Ratio, as disclosed by the DVLA",
                        "format": "double",
                        "nullable": true
                      },
                      "MaxPermissibleBrakedTrailerMassKg": {
                        "title": "MaxPermissibleBrakedTrailerMassKg",
                        "type": "integer",
                        "description": "Maximum technically permissible mass of a braked trailer.",
                        "format": "int32",
                        "nullable": true
                      },
                      "MaxPermissibleUnbrakedTrailerMassKg": {
                        "title": "MaxPermissibleUnbrakedTrailerMassKg",
                        "type": "integer",
                        "description": "Maximum technically permissible mass of an unbraked trailer.",
                        "format": "int32",
                        "nullable": true
                      }
                    },
                    "nullable": true
                  },
                  "StatusCode": {
                    "title": "StatusCode",
                    "enum": [
                      0,
                      1,
                      2,
                      3,
                      4,
                      5,
                      6,
                      7,
                      8,
                      9,
                      10,
                      11,
                      12,
                      13,
                      14,
                      15,
                      17,
                      18,
                      19,
                      20,
                      21,
                      22,
                      23,
                      24,
                      25,
                      26,
                      27,
                      28,
                      29
                    ],
                    "type": "integer",
                    "description": "API Response Status Code.\n0 = Success\n1 = SuccessWithResultsBlockWarnings\n2 = NoResultsFound\n3 = BillingFailure\n4 = FilterIpFailure\n5 = FilterCustomFailure\n6 = SandboxValidationFailure\n7 = UnknownApiKey\n8 = UnknownPackage\n9 = UnknownSearchType\n10 = ThirdPartyFailure\n11 = FailedPackageRule\n12 = BadlyFormedUrl\n13 = InvalidSearchTerm\n14 = NoSearchTermFound\n15 = MultipleSearchTermsFound\n17 = InformationTemporarilyUnavailable\n18 = PackageRestrictedFromApiKey\n19 = ApiKeyReachedConcurrentLimit\n20 = ApiKeyReachedDailyLimit\n21 = PlateInRetentionLastVehicleReturned\n22 = ApiKeyInvalidForPackage\n23 = AccountNotActive\n24 = DataIntegrityWarning\n25 = NoDvlaRegistrationDataAvailable\n26 = NoMatchFound\n27 = PackageReachedConcurrentLimit\n28 = PackageReachedDailyLimit\n29 = UnknownRevision",
                    "format": "int32",
                    "example": 0
                  },
                  "StatusMessage": {
                    "title": "StatusMessage",
                    "type": "string",
                    "description": "API Response Status Message. Human description describing the API response.",
                    "nullable": true
                  },
                  "DocumentVersion": {
                    "title": "DocumentVersion",
                    "type": "integer",
                    "description": "Data Source Versioning.",
                    "format": "int32"
                  }
                }
              },
              "ModelDetails": {
                "type": "object",
                "properties": {
                  "ModelIdentification": {
                    "type": "object",
                    "properties": {
                      "Make": {
                        "title": "Make",
                        "type": "string",
                        "description": "Vehicle make (eg: Ford, Volkswagen, Audi).",
                        "nullable": true
                      },
                      "Range": {
                        "title": "Range",
                        "type": "string",
                        "description": "Vehicle range (eg: C-Max, Focus).",
                        "nullable": true
                      },
                      "Model": {
                        "title": "Model",
                        "type": "string",
                        "description": "Vehicle model (eg: C-Max Style TDCi, Focus LX).",
                        "nullable": true
                      },
                      "ModelVariant": {
                        "title": "ModelVariant",
                        "type": "string",
                        "description": "This is the model variant,  Will be null if we have no variants",
                        "nullable": true
                      },
                      "Series": {
                        "title": "Series",
                        "type": "string",
                        "description": "The model series assigned by the manufacturer (eg: C214, E46).",
                        "nullable": true
                      },
                      "Mark": {
                        "title": "Mark",
                        "type": "integer",
                        "description": "eg: VW Golf Mark 2 where a manufacturer uses it, if they do not, it will always be 1.",
                        "format": "int32",
                        "nullable": true
                      },
                      "StartDate": {
                        "title": "StartDate",
                        "type": "string",
                        "description": "Manufacturer's start date for this vehicle Make, Model, Series.",
                        "format": "date-time",
                        "nullable": true
                      },
                      "EndDate": {
                        "title": "EndDate",
                        "type": "string",
                        "description": "Manufacturer's end date for this vehicle Make, Model, Series.",
                        "format": "date-time",
                        "nullable": true
                      },
                      "CountryOfOrigin": {
                        "title": "CountryOfOrigin",
                        "type": "string",
                        "description": "Country where the vehicle was manufactured.",
                        "nullable": true
                      },
                      "VariantCode": {
                        "title": "VariantCode",
                        "type": "integer",
                        "description": "Code number identifying the vehicle variant (model variation). Will be null if we have no variants.",
                        "format": "int32",
                        "nullable": true
                      }
                    },
                    "nullable": true
                  },
                  "ModelClassification": {
                    "type": "object",
                    "properties": {
                      "TypeApprovalCategory": {
                        "title": "TypeApprovalCategory",
                        "type": "string",
                        "description": "The type approval category code assigned to this type of vehicle.",
                        "nullable": true,
                        "example": "L1"
                      },
                      "MarketSectorCode": {
                        "title": "MarketSectorCode",
                        "type": "string",
                        "description": "The market sector code assigned to this type of vehicle.",
                        "nullable": true
                      },
                      "VehicleClass": {
                        "title": "VehicleClass",
                        "type": "string",
                        "description": "The class of vehicle (eg: Car).",
                        "nullable": true
                      },
                      "TaxationClass": {
                        "title": "TaxationClass",
                        "type": "string",
                        "description": "Taxation class is determined from type approval category, possible results are Car, PVC, LCV, HCV or Quad.",
                        "nullable": true
                      }
                    },
                    "nullable": true
                  },
                  "AdditionalInformation": {
                    "type": "object",
                    "properties": {
                      "VehicleWarrantyInformation": {
                        "type": "object",
                        "properties": {
                          "ManufacturerWarrantyMiles": {
                            "title": "ManufacturerWarrantyMiles",
                            "type": "integer",
                            "description": "Manufacturer warranty from new, in miles (ie: 30,000 miles warranty).",
                            "format": "int32",
                            "nullable": true
                          },
                          "ManufacturerWarrantyMonths": {
                            "title": "ManufacturerWarrantyMonths",
                            "type": "integer",
                            "description": "Manufacturer warranty from new, in months (ie: 60 months warranty).",
                            "format": "int32",
                            "nullable": true
                          }
                        },
                        "nullable": true
                      },
                      "SubscriptionOptionList": {
                        "title": "SubscriptionOptionList",
                        "type": "array",
                        "items": {
                          "type": "object",
                          "properties": {
                            "Name": {
                              "title": "Name",
                              "type": "string",
                              "description": "Name of the subscription service",
                              "nullable": true
                            }
                          }
                        },
                        "description": "List containing Subscription Options available for this vehicle."
                      },
                      "Software": {
                        "type": "object",
                        "properties": {
                          "SupportsOverTheAirSoftwareUpdate": {
                            "title": "SupportsOverTheAirSoftwareUpdate",
                            "type": "boolean",
                            "description": "Indicates whether or not the vehicle supports over the air software updates.",
                            "nullable": true
                          }
                        },
                        "nullable": true
                      }
                    },
                    "nullable": true
                  },
                  "BodyDetails": {
                    "type": "object",
                    "properties": {
                      "BodyShape": {
                        "title": "BodyShape",
                        "type": "string",
                        "description": "Applicable to commercial vehicles to confirm the body shape.",
                        "nullable": true
                      },
                      "BodyStyle": {
                        "title": "BodyStyle",
                        "type": "string",
                        "description": "The body shape of this vehicle (eg: Saloon, Hatchback, MPV).",
                        "nullable": true
                      },
                      "CabType": {
                        "title": "CabType",
                        "type": "string",
                        "description": "Applicable to commercial vehicles (eg: Luton Van).",
                        "nullable": true
                      },
                      "PlatformName": {
                        "title": "PlatformName",
                        "type": "string",
                        "description": "The name of the platform the vehicle is based on.",
                        "nullable": true
                      },
                      "PlatformIsSharedAcrossModels": {
                        "title": "PlatformIsSharedAcrossModels",
                        "type": "boolean",
                        "description": "Indicates whether or not the platform is shared across multiple models.",
                        "nullable": true
                      },
                      "WheelbaseType": {
                        "title": "WheelbaseType",
                        "type": "string",
                        "description": "The wheelbase type for this vehicle (eg: Short Wheelbase, Long Wheelbase).",
                        "nullable": true
                      },
                      "NumberOfAxles": {
                        "title": "NumberOfAxles",
                        "type": "integer",
                        "description": "The number of axles on this vehicle.",
                        "format": "int32",
                        "nullable": true
                      },
                      "NumberOfDoors": {
                        "title": "NumberOfDoors",
                        "type": "integer",
                        "description": "The number of doors on this vehicle.",
                        "format": "int32",
                        "nullable": true
                      },
                      "NumberOfSeats": {
                        "title": "NumberOfSeats",
                        "type": "integer",
                        "description": "Number of seats for this vehicle.",
                        "format": "int32",
                        "nullable": true
                      },
                      "PayloadVolumeLitres": {
                        "title": "PayloadVolumeLitres",
                        "type": "number",
                        "description": "The volume of the load area.",
                        "format": "double",
                        "nullable": true
                      },
                      "FuelTankCapacityLitres": {
                        "title": "FuelTankCapacityLitres",
                        "type": "integer",
                        "description": "Fuel tank capacity expressed in litres.",
                        "format": "int32",
                        "nullable": true
                      }
                    },
                    "nullable": true
                  },
                  "Dimensions": {
                    "type": "object",
                    "properties": {
                      "HeightMm": {
                        "title": "HeightMm",
                        "type": "integer",
                        "description": "Overall height of the vehicle, including roof-bars or aerial.",
                        "format": "int32",
                        "nullable": true
                      },
                      "LengthMm": {
                        "title": "LengthMm",
                        "type": "integer",
                        "description": "Overall length of the vehicle (bumper to bumper). Does not include any after market items, which may extended the length of the vehicle.",
                        "format": "int32",
                        "nullable": true
                      },
                      "WidthMm": {
                        "title": "WidthMm",
                        "type": "integer",
                        "description": "Overall width, including the wing mirrors.",
                        "format": "int32",
                        "nullable": true
                      },
                      "WheelbaseLengthMm": {
                        "title": "WheelbaseLengthMm",
                        "type": "integer",
                        "description": "Wheelbase length of the vehicle expressed in mm.",
                        "format": "int32",
                        "nullable": true
                      },
                      "InternalLoadLengthMm": {
                        "title": "InternalLoadLengthMm",
                        "type": "integer",
                        "description": "Applies to commercial vehicle. Length from the bulkhead to the rear of the load area expressed in mm.",
                        "format": "int32",
                        "nullable": true
                      }
                    },
                    "nullable": true
                  },
                  "Weights": {
                    "type": "object",
                    "properties": {
                      "KerbWeightKg": {
                        "title": "KerbWeightKg",
                        "type": "integer",
                        "description": "The weight of the vehicle, including a full tank of fuel and all standard equipment.",
                        "format": "int32",
                        "nullable": true
                      },
                      "GrossTrainWeightKg": {
                        "title": "GrossTrainWeightKg",
                        "type": "integer",
                        "description": "The maximum permissible weight the vehicle, including any trailer.",
                        "format": "int32",
                        "nullable": true
                      },
                      "UnladenWeightKg": {
                        "title": "UnladenWeightKg",
                        "type": "integer",
                        "description": "The weight of the vehicle, including all standard equipment.",
                        "format": "int32",
                        "nullable": true
                      },
                      "PayloadWeightKg": {
                        "title": "PayloadWeightKg",
                        "type": "integer",
                        "description": "The difference between the Kerb Weight and the Gross Weight.",
                        "format": "int32",
                        "nullable": true
                      },
                      "GrossVehicleWeightKg": {
                        "title": "GrossVehicleWeightKg",
                        "type": "integer",
                        "description": "The total weight of the vehicle including the Kerb Weight and Payload Weight.",
                        "format": "int32",
                        "nullable": true
                      },
                      "GrossCombinedWeightKg": {
                        "title": "GrossCombinedWeightKg",
                        "type": "integer",
                        "description": "The total combined weight: Fully laden vehicle and fully laden trailer added together.",
                        "format": "int32",
                        "nullable": true
                      }
                    },
                    "nullable": true
                  },
                  "Powertrain": {
                    "type": "object",
                    "properties": {
                      "PowertrainType": {
                        "title": "PowertrainType",
                        "type": "string",
                        "description": "Vehicle powertrain type (eg; ICE, REEV, BEV, PHEV).",
                        "nullable": true,
                        "example": "ICE"
                      },
                      "FuelType": {
                        "title": "FuelType",
                        "type": "string",
                        "description": "Fuel type for this vehicle (eg: DIESEL, PETROL).",
                        "nullable": true,
                        "example": "CNG"
                      },
                      "IceDetails": {
                        "type": "object",
                        "properties": {
                          "EngineFamily": {
                            "title": "EngineFamily",
                            "type": "string",
                            "description": "A family is a basic unit used to identify a family/group of engines for certification and compliance purposes.",
                            "nullable": true
                          },
                          "EngineLocation": {
                            "title": "EngineLocation",
                            "type": "string",
                            "description": "The relative location of the engine within the vehicle.",
                            "nullable": true
                          },
                          "EngineDescription": {
                            "title": "EngineDescription",
                            "type": "string",
                            "description": "Describes the type of engine.",
                            "nullable": true
                          },
                          "EngineManufacturer": {
                            "title": "EngineManufacturer",
                            "type": "string",
                            "description": "The manufacturer of the engine.",
                            "nullable": true
                          },
                          "FuelDelivery": {
                            "title": "FuelDelivery",
                            "type": "string",
                            "description": "The fuel delivery mechanism used in the engine (eg: Injection).",
                            "nullable": true
                          },
                          "Aspiration": {
                            "title": "Aspiration",
                            "type": "string",
                            "description": "The type of aspiration mechanism used in the engine (eg: Turbo charged, naturally aspirated).",
                            "nullable": true
                          },
                          "CylinderArrangement": {
                            "title": "CylinderArrangement",
                            "type": "string",
                            "description": "The arrangement of the cylinders within the engine (eg: Inline, Vee, W, Rotary).",
                            "nullable": true
                          },
                          "NumberOfCylinders": {
                            "title": "NumberOfCylinders",
                            "type": "integer",
                            "description": "The number of cylinders within the engine.",
                            "format": "int32",
                            "nullable": true
                          },
                          "BoreMm": {
                            "title": "BoreMm",
                            "type": "integer",
                            "description": "Diameter of cylinder.",
                            "format": "int32",
                            "nullable": true
                          },
                          "StrokeMm": {
                            "title": "StrokeMm",
                            "type": "integer",
                            "description": "Length of the swept volume of the cylinder expressed in mm.  This is the distance the piston travels between top and bottom dead centre of the stroke.",
                            "format": "int32",
                            "nullable": true
                          },
                          "ValveGear": {
                            "title": "ValveGear",
                            "type": "string",
                            "description": "Describes the valve actuation mechanism used in the engine (eg: DOHC, OHC).",
                            "nullable": true
                          },
                          "ValvesPerCylinder": {
                            "title": "ValvesPerCylinder",
                            "type": "integer",
                            "description": "The number of valves per cylinder.",
                            "format": "int32",
                            "nullable": true
                          },
                          "EngineCapacityCc": {
                            "title": "EngineCapacityCc",
                            "type": "integer",
                            "description": "The cubic capacity of the engine.",
                            "format": "int32",
                            "nullable": true
                          },
                          "EngineCapacityLitres": {
                            "title": "EngineCapacityLitres",
                            "type": "number",
                            "description": "The cubic capacity in litres of the engine rounded up or down. Based on the Engine Capacity CC.",
                            "format": "double",
                            "nullable": true
                          }
                        },
                        "nullable": true
                      },
                      "EvDetails": {
                        "type": "object",
                        "properties": {
                          "TechnicalDetails": {
                            "type": "object",
                            "properties": {
                              "PowertrainType": {
                                "title": "PowertrainType",
                                "type": "string",
                                "description": "Powertrain types (eg: ICE, REEV, BEV, PHEV).",
                                "nullable": true,
                                "example": "Uncategorised"
                              },
                              "IsTeslaSuperchargerCompatible": {
                                "title": "IsTeslaSuperchargerCompatible",
                                "type": "boolean",
                                "description": "Indicates whether or not the hardware is compatible with Tesla Superchargers."
                              },
                              "NumberOfChargePorts": {
                                "title": "NumberOfChargePorts",
                                "type": "integer",
                                "description": "Number of charge ports available on the vehicle.",
                                "format": "int32"
                              },
                              "TeslaSupercharging": {
                                "type": "object",
                                "properties": {
                                  "Version1": {
                                    "type": "object",
                                    "properties": {
                                      "IsCompatibleWithVehicle": {
                                        "title": "IsCompatibleWithVehicle",
                                        "type": "boolean",
                                        "description": "This supercharging version is compatible with the vehicle.",
                                        "nullable": true
                                      },
                                      "MaxChargeKw": {
                                        "title": "MaxChargeKw",
                                        "type": "integer",
                                        "description": "The maximum charge in Kilowatts for this supercharger version",
                                        "format": "int32",
                                        "nullable": true
                                      },
                                      "RequiresCcsAdaptor": {
                                        "title": "RequiresCcsAdaptor",
                                        "type": "boolean",
                                        "description": "CCS (Combined Charging System) Does this supercharger version require a CCS Adaptor?",
                                        "nullable": true
                                      },
                                      "AverageChargeTime10To80Percent": {
                                        "title": "AverageChargeTime10To80Percent",
                                        "type": "integer",
                                        "description": "The average time taken using this supercharger version from 10% to 80%",
                                        "format": "int32",
                                        "nullable": true
                                      }
                                    },
                                    "nullable": true
                                  },
                                  "Version2": {
                                    "type": "object",
                                    "properties": {
                                      "IsCompatibleWithVehicle": {
                                        "title": "IsCompatibleWithVehicle",
                                        "type": "boolean",
                                        "description": "This supercharging version is compatible with the vehicle.",
                                        "nullable": true
                                      },
                                      "MaxChargeKw": {
                                        "title": "MaxChargeKw",
                                        "type": "integer",
                                        "description": "The maximum charge in Kilowatts for this supercharger version",
                                        "format": "int32",
                                        "nullable": true
                                      },
                                      "RequiresCcsAdaptor": {
                                        "title": "RequiresCcsAdaptor",
                                        "type": "boolean",
                                        "description": "CCS (Combined Charging System) Does this supercharger version require a CCS Adaptor?",
                                        "nullable": true
                                      },
                                      "AverageChargeTime10To80Percent": {
                                        "title": "AverageChargeTime10To80Percent",
                                        "type": "integer",
                                        "description": "The average time taken using this supercharger version from 10% to 80%",
                                        "format": "int32",
                                        "nullable": true
                                      }
                                    },
                                    "nullable": true
                                  },
                                  "Version3": {
                                    "type": "object",
                                    "properties": {
                                      "IsCompatibleWithVehicle": {
                                        "title": "IsCompatibleWithVehicle",
                                        "type": "boolean",
                                        "description": "This supercharging version is compatible with the vehicle.",
                                        "nullable": true
                                      },
                                      "MaxChargeKw": {
                                        "title": "MaxChargeKw",
                                        "type": "integer",
                                        "description": "The maximum charge in Kilowatts for this supercharger version",
                                        "format": "int32",
                                        "nullable": true
                                      },
                                      "RequiresCcsAdaptor": {
                                        "title": "RequiresCcsAdaptor",
                                        "type": "boolean",
                                        "description": "CCS (Combined Charging System) Does this supercharger version require a CCS Adaptor?",
                                        "nullable": true
                                      },
                                      "AverageChargeTime10To80Percent": {
                                        "title": "AverageChargeTime10To80Percent",
                                        "type": "integer",
                                        "description": "The average time taken using this supercharger version from 10% to 80%",
                                        "format": "int32",
                                        "nullable": true
                                      }
                                    },
                                    "nullable": true
                                  }
                                },
                                "nullable": true
                              },
                              "ChargeCableDetailsList": {
                                "title": "ChargeCableDetailsList",
                                "type": "array",
                                "items": {
                                  "type": "object",
                                  "properties": {
                                    "IsSuppliedAsStandard": {
                                      "title": "IsSuppliedAsStandard",
                                      "type": "boolean",
                                      "description": "Indicates whether or not this charge cable is supplied as standard (rather than being an optional extra)."
                                    },
                                    "Description": {
                                      "title": "Description",
                                      "type": "string",
                                      "description": "Charge cable description.",
                                      "nullable": true
                                    }
                                  }
                                },
                                "description": "List of charge cable details for the vehicle."
                              },
                              "ChargePortDetailsList": {
                                "title": "ChargePortDetailsList",
                                "type": "array",
                                "items": {
                                  "type": "object",
                                  "properties": {
                                    "PortType": {
                                      "title": "PortType",
                                      "type": "string",
                                      "description": "The type of port for this charge port item.",
                                      "nullable": true,
                                      "example": "Type 1"
                                    },
                                    "LocationOnVehicle": {
                                      "title": "LocationOnVehicle",
                                      "type": "string",
                                      "description": "The location of this charge port on vehicle.",
                                      "nullable": true,
                                      "example": "Left/Front"
                                    },
                                    "MaxChargePowerKw": {
                                      "title": "MaxChargePowerKw",
                                      "type": "number",
                                      "description": "The maximum capacity of the onboard charger for this charge port item.",
                                      "format": "double",
                                      "nullable": true
                                    },
                                    "IsStandardChargePort": {
                                      "title": "IsStandardChargePort",
                                      "type": "boolean",
                                      "description": "Is this a standard charge port?"
                                    },
                                    "ChargeTimes": {
                                      "type": "object",
                                      "properties": {
                                        "AverageChargeTimes10To80Percent": {
                                          "title": "AverageChargeTimes10To80Percent",
                                          "type": "array",
                                          "items": {
                                            "type": "object",
                                            "properties": {
                                              "ChargePortKw": {
                                                "title": "ChargePortKw",
                                                "type": "number",
                                                "description": "The rate of power delivery.",
                                                "format": "double",
                                                "nullable": true
                                              },
                                              "TimeInMinutes": {
                                                "title": "TimeInMinutes",
                                                "type": "integer",
                                                "description": "The time in minutes to go from 10% to 80%.",
                                                "format": "int32",
                                                "nullable": true
                                              }
                                            }
                                          },
                                          "description": "List containing details for average charge times"
                                        }
                                      },
                                      "nullable": true
                                    }
                                  }
                                },
                                "description": "List containing Charge Port details."
                              },
                              "BatteryDetailsList": {
                                "title": "BatteryDetailsList",
                                "type": "array",
                                "items": {
                                  "type": "object",
                                  "properties": {
                                    "TotalCapacityKwh": {
                                      "title": "TotalCapacityKwh",
                                      "type": "number",
                                      "description": "The total (design maximum) capacity of the battery in Kilowatts/per hour.",
                                      "format": "double",
                                      "nullable": true
                                    },
                                    "UsableCapacityKwh": {
                                      "title": "UsableCapacityKwh",
                                      "type": "number",
                                      "description": "The usable capacity of the battery in Kilowatts/per hour.",
                                      "format": "double",
                                      "nullable": true
                                    },
                                    "Description": {
                                      "title": "Description",
                                      "type": "string",
                                      "description": "Description of the battery.",
                                      "nullable": true
                                    },
                                    "Chemistry": {
                                      "title": "Chemistry",
                                      "type": "string",
                                      "description": "Battery chemistry type (eg: Lithium-ion).",
                                      "nullable": true
                                    },
                                    "Voltage": {
                                      "title": "Voltage",
                                      "type": "integer",
                                      "description": "The voltage of the battery.",
                                      "format": "int32",
                                      "nullable": true
                                    },
                                    "LocationOnVehicle": {
                                      "title": "LocationOnVehicle",
                                      "type": "string",
                                      "description": "Battery location on the vehicle.",
                                      "nullable": true,
                                      "example": "UnderChassis"
                                    },
                                    "ManufacturerWarrantyMonths": {
                                      "title": "ManufacturerWarrantyMonths",
                                      "type": "integer",
                                      "description": "The number of months (from new) where the battery is covered under a manufacturers warranty.",
                                      "format": "int32",
                                      "nullable": true
                                    },
                                    "ManufacturerWarrantyMiles": {
                                      "title": "ManufacturerWarrantyMiles",
                                      "type": "integer",
                                      "description": "The number of miles (from new) where the battery is covered under a manufacturers warranty.",
                                      "format": "int32",
                                      "nullable": true
                                    }
                                  }
                                },
                                "description": "List containing Battery details."
                              },
                              "MotorDetailsList": {
                                "title": "MotorDetailsList",
                                "type": "array",
                                "items": {
                                  "type": "object",
                                  "properties": {
                                    "Manufacturer": {
                                      "title": "Manufacturer",
                                      "type": "string",
                                      "description": "The manufacturer of the motor.",
                                      "nullable": true
                                    },
                                    "Model": {
                                      "title": "Model",
                                      "type": "string",
                                      "description": "The model of the motor.",
                                      "nullable": true
                                    },
                                    "MotorType": {
                                      "title": "MotorType",
                                      "type": "string",
                                      "description": "Type of motor (eg: AC induction/asynchronous).",
                                      "nullable": true
                                    },
                                    "PowerKw": {
                                      "title": "PowerKw",
                                      "type": "integer",
                                      "description": "Total power in killowatts",
                                      "format": "int32",
                                      "nullable": true
                                    },
                                    "MaxPowerRpm": {
                                      "title": "MaxPowerRpm",
                                      "type": "integer",
                                      "description": "The maximum power described in RPM (Revolutions Per Minute).",
                                      "format": "int32",
                                      "nullable": true
                                    },
                                    "MaxTorqueNm": {
                                      "title": "MaxTorqueNm",
                                      "type": "integer",
                                      "description": "The maximum power described in Torque Nm (Torque Newton Metres).",
                                      "format": "int32",
                                      "nullable": true
                                    },
                                    "SupportsRegenerativeBraking": {
                                      "title": "SupportsRegenerativeBraking",
                                      "type": "boolean",
                                      "description": "Supports recovery of kinetic energy to the battery whilst the vehicle is braking.",
                                      "nullable": true
                                    },
                                    "MotorLocation": {
                                      "title": "MotorLocation",
                                      "type": "string",
                                      "description": "The location of the motor.",
                                      "nullable": true,
                                      "example": "RearAxle"
                                    },
                                    "AxleDrivenByMotor": {
                                      "title": "AxleDrivenByMotor",
                                      "type": "string",
                                      "description": "Identifies which axle is driven by this motor.",
                                      "nullable": true
                                    },
                                    "AdditionalInformation": {
                                      "title": "AdditionalInformation",
                                      "type": "string",
                                      "description": "Additional information for this motor.",
                                      "nullable": true
                                    }
                                  }
                                },
                                "description": "List containing Motor details."
                              },
                              "TransmissionDetailsList": {
                                "title": "TransmissionDetailsList",
                                "type": "array",
                                "items": {
                                  "type": "object",
                                  "properties": {
                                    "TransmissionType": {
                                      "title": "TransmissionType",
                                      "type": "string",
                                      "description": "The transmission type (eg: Automatic, CVT, Manual).",
                                      "nullable": true
                                    },
                                    "NumberOfGears": {
                                      "title": "NumberOfGears",
                                      "type": "integer",
                                      "description": "The number of forward gears.",
                                      "format": "int32",
                                      "nullable": true
                                    },
                                    "TransmissionLocation": {
                                      "title": "TransmissionLocation",
                                      "type": "string",
                                      "description": "The location of the transmission.",
                                      "nullable": true,
                                      "example": "Unknown"
                                    }
                                  }
                                },
                                "description": "List containing Transmission details."
                              }
                            },
                            "nullable": true
                          },
                          "Performance": {
                            "type": "object",
                            "properties": {
                              "MaxChargeInputPowerKw": {
                                "title": "MaxChargeInputPowerKw",
                                "type": "integer",
                                "description": "Maximum input charge power the vehicle can accept in Kw.",
                                "format": "int32",
                                "nullable": true
                              },
                              "WhMile": {
                                "title": "WhMile",
                                "type": "integer",
                                "description": "The amount of energy used to travel one mile.",
                                "format": "int32",
                                "nullable": true
                              },
                              "RangeFigures": {
                                "type": "object",
                                "properties": {
                                  "RealRangeMiles": {
                                    "title": "RealRangeMiles",
                                    "type": "integer",
                                    "description": "Vehicle range (in miles) tested under real driving conditions.",
                                    "format": "int32",
                                    "nullable": true
                                  },
                                  "RealRangeKm": {
                                    "title": "RealRangeKm",
                                    "type": "integer",
                                    "description": "Vehicle range (in kilometers) tested under real driving conditions.",
                                    "format": "int32",
                                    "nullable": true
                                  },
                                  "MilesPerChargeHour": {
                                    "title": "MilesPerChargeHour",
                                    "type": "integer",
                                    "description": "The estimated vehicle range gained hour of charge.",
                                    "format": "int32",
                                    "nullable": true
                                  },
                                  "ZeroEmissionMiles": {
                                    "title": "ZeroEmissionMiles",
                                    "type": "integer",
                                    "description": "How many miles the vehicle can travel producing zero emissions.",
                                    "format": "int32",
                                    "nullable": true
                                  }
                                },
                                "nullable": true
                              }
                            },
                            "nullable": true
                          },
                          "DocumentVersion": {
                            "title": "DocumentVersion",
                            "type": "integer",
                            "description": "Data Source Versioning.",
                            "format": "int32"
                          }
                        },
                        "nullable": true
                      },
                      "Transmission": {
                        "type": "object",
                        "properties": {
                          "TransmissionType": {
                            "title": "TransmissionType",
                            "type": "string",
                            "description": "The transmission type (eg: Automatic, CVT, Manual).",
                            "nullable": true,
                            "example": "Automatic"
                          },
                          "NumberOfGears": {
                            "title": "NumberOfGears",
                            "type": "integer",
                            "description": "The number of forward gears.",
                            "format": "int32",
                            "nullable": true
                          },
                          "DriveType": {
                            "title": "DriveType",
                            "type": "string",
                            "description": "Number of wheels x number of driven wheels (eg: 4x4, 4x2).",
                            "nullable": true
                          },
                          "DrivingAxle": {
                            "title": "DrivingAxle",
                            "type": "string",
                            "description": "Which axle the motor is delivering power to.",
                            "nullable": true
                          }
                        },
                        "nullable": true
                      }
                    },
                    "nullable": true
                  },
                  "Safety": {
                    "type": "object",
                    "properties": {
                      "EuroNcap": {
                        "type": "object",
                        "properties": {
                          "NcapStarRating": {
                            "title": "NcapStarRating",
                            "type": "integer",
                            "description": "NCAP (The European New Car Assessment Programme) The safety rating as assigned by NCAP.",
                            "format": "int32",
                            "nullable": true
                          },
                          "NcapChildPercent": {
                            "title": "NcapChildPercent",
                            "type": "integer",
                            "description": "The NCAP percentage - rated level of protection for a child occupant, in the event of an impact.",
                            "format": "int32",
                            "nullable": true
                          },
                          "NcapAdultPercent": {
                            "title": "NcapAdultPercent",
                            "type": "integer",
                            "description": "The NCAP percentage - rated level of protection for a adult occupant, in the event of an impact.",
                            "format": "int32",
                            "nullable": true
                          },
                          "NcapPedestrianPercent": {
                            "title": "NcapPedestrianPercent",
                            "type": "integer",
                            "description": "The NCAP percentage - rated level of protection for a pedestrian, in the event of an impact.",
                            "format": "int32",
                            "nullable": true
                          },
                          "NcapSafetyAssistPercent": {
                            "title": "NcapSafetyAssistPercent",
                            "type": "integer",
                            "description": "The NCAP percentage - rated level of the vehicles braking and warning systems.",
                            "format": "int32",
                            "nullable": true
                          }
                        },
                        "nullable": true
                      }
                    },
                    "nullable": true
                  },
                  "Emissions": {
                    "type": "object",
                    "properties": {
                      "EuroStatus": {
                        "title": "EuroStatus",
                        "type": "string",
                        "description": "European emission standard. Value indicates the emission levels in line with the age of the vehicle.",
                        "nullable": true
                      },
                      "ManufacturerCo2": {
                        "title": "ManufacturerCo2",
                        "type": "integer",
                        "description": "The manufacturer's claimed level of CO2 emissions.",
                        "format": "int32",
                        "nullable": true
                      },
                      "SoundLevels": {
                        "type": "object",
                        "properties": {
                          "StationaryDb": {
                            "title": "StationaryDb",
                            "type": "integer",
                            "description": "Sound level, in decibels, measured whilst vehicle is stationary.",
                            "format": "int32",
                            "nullable": true
                          },
                          "EngineSpeedRpm": {
                            "title": "EngineSpeedRpm",
                            "type": "integer",
                            "description": "Engine speed at which sound measurements are taken.",
                            "format": "int32",
                            "nullable": true
                          },
                          "DriveByDb": {
                            "title": "DriveByDb",
                            "type": "integer",
                            "description": "Sound level, in decibels, measured for the drive by test.",
                            "format": "int32",
                            "nullable": true
                          }
                        },
                        "nullable": true
                      }
                    },
                    "nullable": true
                  },
                  "Performance": {
                    "type": "object",
                    "properties": {
                      "DragCoefficient": {
                        "title": "DragCoefficient",
                        "type": "number",
                        "description": "A dimensionless quantity that is used to quantify the drag or resistance of an object in a fluid environment. Used for aerodynamic drag calculation in the case of a road vehicle.",
                        "format": "double",
                        "nullable": true
                      },
                      "Torque": {
                        "type": "object",
                        "properties": {
                          "Nm": {
                            "title": "Nm",
                            "type": "number",
                            "description": "Maximum torque expressed in Nm (Newton Metre).",
                            "format": "double",
                            "nullable": true
                          },
                          "LbFt": {
                            "title": "LbFt",
                            "type": "number",
                            "description": "Maximum torque expressed in LbFt (Pound Foot).",
                            "format": "double",
                            "nullable": true
                          },
                          "Rpm": {
                            "title": "Rpm",
                            "type": "integer",
                            "description": "Engine RPM where peak torque is achieved.",
                            "format": "int32",
                            "nullable": true
                          }
                        },
                        "nullable": true
                      },
                      "Power": {
                        "type": "object",
                        "properties": {
                          "Bhp": {
                            "title": "Bhp",
                            "type": "number",
                            "description": "Maximum power expressed in BHP (Brake Horse Power).",
                            "format": "double",
                            "nullable": true
                          },
                          "Ps": {
                            "title": "Ps",
                            "type": "number",
                            "description": "Maximum power expressed in PS (PferdStarke is the metric measure of horsepower. It is the equivalent of 98.6% of one HP).",
                            "format": "double",
                            "nullable": true
                          },
                          "Kw": {
                            "title": "Kw",
                            "type": "number",
                            "description": "Maximum power expressed in kW (Kilowatts).",
                            "format": "double",
                            "nullable": true
                          },
                          "Rpm": {
                            "title": "Rpm",
                            "type": "integer",
                            "description": "Engine RPM where peak power is achieved.",
                            "format": "int32",
                            "nullable": true
                          }
                        },
                        "nullable": true
                      },
                      "Statistics": {
                        "type": "object",
                        "properties": {
                          "ZeroToSixtyMph": {
                            "title": "ZeroToSixtyMph",
                            "type": "number",
                            "description": "Manufacturer's claimed time for accelerating from 0 to 60 miles per hour, expressed in seconds.",
                            "format": "double",
                            "nullable": true
                          },
                          "ZeroToOneHundredKph": {
                            "title": "ZeroToOneHundredKph",
                            "type": "number",
                            "description": "Manufacturer's claimed time for accelerating from 0 to 100 kilometers per hour, expressed in seconds.",
                            "format": "double",
                            "nullable": true
                          },
                          "MaxSpeedKph": {
                            "title": "MaxSpeedKph",
                            "type": "integer",
                            "description": "The manufacturer's claimed top speed expressed in kilometers per hour.",
                            "format": "int32",
                            "nullable": true
                          },
                          "MaxSpeedMph": {
                            "title": "MaxSpeedMph",
                            "type": "integer",
                            "description": "The manufacturer's claimed top speed expressed in miles per hour.",
                            "format": "int32",
                            "nullable": true
                          }
                        },
                        "nullable": true
                      },
                      "FuelEconomy": {
                        "type": "object",
                        "properties": {
                          "UrbanColdMpg": {
                            "title": "UrbanColdMpg",
                            "type": "number",
                            "description": "Urban Cold fuel consumption in Miles per Gallon.",
                            "format": "double",
                            "nullable": true
                          },
                          "ExtraUrbanMpg": {
                            "title": "ExtraUrbanMpg",
                            "type": "number",
                            "description": "Extra Urban fuel consumption in Miles per Gallon.",
                            "format": "double",
                            "nullable": true
                          },
                          "CombinedMpg": {
                            "title": "CombinedMpg",
                            "type": "number",
                            "description": "Combined fuel consumption in Miles per Gallon.",
                            "format": "double",
                            "nullable": true
                          },
                          "UrbanColdL100Km": {
                            "title": "UrbanColdL100Km",
                            "type": "number",
                            "description": "Urban Cold fuel consumption in Litres per 100 kilometers.",
                            "format": "double",
                            "nullable": true
                          },
                          "ExtraUrbanL100Km": {
                            "title": "ExtraUrbanL100Km",
                            "type": "number",
                            "description": "Extra Urban fuel consumption in Litres per 100 kilometers.",
                            "format": "double",
                            "nullable": true
                          },
                          "CombinedL100Km": {
                            "title": "CombinedL100Km",
                            "type": "number",
                            "description": "Combined fuel consumption in Litres per 100 kilometers.",
                            "format": "double",
                            "nullable": true
                          }
                        },
                        "nullable": true
                      }
                    },
                    "nullable": true
                  },
                  "StatusCode": {
                    "title": "StatusCode",
                    "enum": [
                      0,
                      1,
                      2,
                      3,
                      4,
                      5,
                      6,
                      7,
                      8,
                      9,
                      10,
                      11,
                      12,
                      13,
                      14,
                      15,
                      17,
                      18,
                      19,
                      20,
                      21,
                      22,
                      23,
                      24,
                      25,
                      26,
                      27,
                      28,
                      29
                    ],
                    "type": "integer",
                    "description": "API Response Status Code.\n0 = Success\n1 = SuccessWithResultsBlockWarnings\n2 = NoResultsFound\n3 = BillingFailure\n4 = FilterIpFailure\n5 = FilterCustomFailure\n6 = SandboxValidationFailure\n7 = UnknownApiKey\n8 = UnknownPackage\n9 = UnknownSearchType\n10 = ThirdPartyFailure\n11 = FailedPackageRule\n12 = BadlyFormedUrl\n13 = InvalidSearchTerm\n14 = NoSearchTermFound\n15 = MultipleSearchTermsFound\n17 = InformationTemporarilyUnavailable\n18 = PackageRestrictedFromApiKey\n19 = ApiKeyReachedConcurrentLimit\n20 = ApiKeyReachedDailyLimit\n21 = PlateInRetentionLastVehicleReturned\n22 = ApiKeyInvalidForPackage\n23 = AccountNotActive\n24 = DataIntegrityWarning\n25 = NoDvlaRegistrationDataAvailable\n26 = NoMatchFound\n27 = PackageReachedConcurrentLimit\n28 = PackageReachedDailyLimit\n29 = UnknownRevision",
                    "format": "int32",
                    "example": 0
                  },
                  "StatusMessage": {
                    "title": "StatusMessage",
                    "type": "string",
                    "description": "API Response Status Message. Human description describing the API response.",
                    "nullable": true
                  },
                  "DocumentVersion": {
                    "title": "DocumentVersion",
                    "type": "integer",
                    "description": "Data Source Versioning.",
                    "format": "int32"
                  }
                }
              }
            },
            "nullable": true
          }
        }
      },
      "ResponseWithoutResults": {
        "type": "object",
        "properties": {
          "RequestInformation": {
            "type": "object",
            "properties": {
              "PackageName": {
                "title": "PackageName",
                "type": "string",
                "description": "The name of the package that was used to make the request.",
                "nullable": true
              },
              "SearchTerm": {
                "title": "SearchTerm",
                "type": "string",
                "description": "The value used to do the look up.",
                "nullable": true
              },
              "SearchType": {
                "title": "SearchType",
                "type": "string",
                "description": "Which data item that is being looked up.",
                "nullable": true
              },
              "RequestIp": {
                "title": "RequestIp",
                "type": "string",
                "description": "The IP address where the request was made from.",
                "nullable": true
              }
            }
          },
          "ResponseInformation": {
            "type": "object",
            "properties": {
              "StatusCode": {
                "title": "StatusCode",
                "enum": [
                  0,
                  1,
                  2,
                  3,
                  4,
                  5,
                  6,
                  7,
                  8,
                  9,
                  10,
                  11,
                  12,
                  13,
                  14,
                  15,
                  17,
                  18,
                  19,
                  20,
                  21,
                  22,
                  23,
                  24,
                  25,
                  26,
                  27,
                  28,
                  29
                ],
                "type": "integer",
                "description": "The status of the response\n0 = Success\n1 = SuccessWithResultsBlockWarnings\n2 = NoResultsFound\n3 = BillingFailure\n4 = FilterIpFailure\n5 = FilterCustomFailure\n6 = SandboxValidationFailure\n7 = UnknownApiKey\n8 = UnknownPackage\n9 = UnknownSearchType\n10 = ThirdPartyFailure\n11 = FailedPackageRule\n12 = BadlyFormedUrl\n13 = InvalidSearchTerm\n14 = NoSearchTermFound\n15 = MultipleSearchTermsFound\n17 = InformationTemporarilyUnavailable\n18 = PackageRestrictedFromApiKey\n19 = ApiKeyReachedConcurrentLimit\n20 = ApiKeyReachedDailyLimit\n21 = PlateInRetentionLastVehicleReturned\n22 = ApiKeyInvalidForPackage\n23 = AccountNotActive\n24 = DataIntegrityWarning\n25 = NoDvlaRegistrationDataAvailable\n26 = NoMatchFound\n27 = PackageReachedConcurrentLimit\n28 = PackageReachedDailyLimit\n29 = UnknownRevision",
                "format": "int32",
                "example": 0
              },
              "StatusMessage": {
                "title": "StatusMessage",
                "type": "string",
                "description": "The status of the response as text",
                "nullable": true
              },
              "IsSuccessStatusCode": {
                "title": "IsSuccessStatusCode",
                "type": "boolean",
                "description": "This returns whether the status of the response indicates that the request was successful."
              },
              "QueryTimeMs": {
                "title": "QueryTimeMs",
                "type": "integer",
                "description": "This is the amount of time the query took to execute in milliseconds",
                "format": "int64"
              },
              "ResponseId": {
                "title": "ResponseId",
                "type": "string",
                "description": "This is the unique identifier of the report. Use this when referring to any issues with the results with support.",
                "format": "uuid"
              }
            }
          },
          "BillingInformation": {
            "type": "object",
            "properties": {
              "BillingTransactionId": {
                "title": "BillingTransactionId",
                "type": "string",
                "description": "This is the unique reference to the billing transaction for this lookup. If missing this transaction did not require any billing to take place.",
                "format": "uuid",
                "nullable": true
              },
              "AccountType": {
                "title": "AccountType",
                "enum": [
                  0,
                  1,
                  2,
                  3,
                  4,
                  5,
                  6
                ],
                "type": "integer",
                "description": "This is the current type of account that defines how the account is billed.\n0 = Trial\n1 = PayGo\n2 = Subscription",
                "format": "int32",
                "example": 0
              },
              "AccountBalance": {
                "title": "AccountBalance",
                "type": "number",
                "description": "The current balance of the account if this is a pay as a go account.",
                "format": "double",
                "nullable": true
              },
              "TransactionCost": {
                "title": "TransactionCost",
                "type": "number",
                "description": "The total cost of the transaction if the transaction required billing.",
                "format": "double",
                "nullable": true
              },
              "BillingResult": {
                "title": "BillingResult",
                "enum": [
                  0,
                  1,
                  2,
                  3,
                  4,
                  50
                ],
                "type": "integer",
                "description": "Whether the account was billed\n0 = Success\n1 = InsufficientFunds\n2 = OverageCapMet\n3 = BillingAccountNotFound\n4 = SandboxKey\n50 = Deferred",
                "format": "int32",
                "example": 0
              },
              "BillingResultMessage": {
                "title": "BillingResultMessage",
                "type": "string",
                "description": "Whether the account was billed in text format",
                "nullable": true
              },
              "RefundAmount": {
                "title": "RefundAmount",
                "type": "number",
                "description": "The amount that was required to be refunded depending on what package data was able to be returned and how the package was set up.",
                "format": "double",
                "nullable": true
              },
              "RefundResult": {
                "title": "RefundResult",
                "enum": [
                  0,
                  50
                ],
                "type": "integer",
                "description": "Whether the transaction had a refund\n0 = Success\n50 = Deferred",
                "format": "int32",
                "nullable": true,
                "example": 0
              },
              "RefundResultMessage": {
                "title": "RefundResultMessage",
                "type": "string",
                "description": "Whether the transaction had a refund in text format",
                "nullable": true
              }
            }
          },
          "Results": {
            "type": "object"
          }
        }
      }
    }
  },
  "externalDocs": {
    "description": "Further API documentation for UK Vehicle Data Limited can be found in your Control Panel.",
    "url": "https://cp.ukvehicledata.co.uk/"
  }
}
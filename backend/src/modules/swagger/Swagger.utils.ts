import { JSONSchema, validationMetadatasToSchemas } from 'class-validator-jsonschema';
import { getMetadataArgsStorage, HttpCode, type MetadataArgsStorage } from 'routing-controllers';
import { OpenAPI, ResponseSchema, routingControllersToSpec } from 'routing-controllers-openapi';
import { SchemaPrefix } from './Swagger.constants';

const { defaultMetadataStorage } = require('class-transformer/cjs/storage');

/** Function that auto-generates Swagger specification for the specified controllers */
export const getSwaggerSpec = (params: {
  /** API version, e.g. 'v1' */
  version: string;
  /**
   * List of controllers to be included in Swagger specification.
   * It can include controller classes or controller file path templates.
   */
  controllers: Function[] | string[];
}) => {
  const { version, controllers } = params;

  const schemas: any = validationMetadatasToSchemas({
    classTransformerMetadataStorage: defaultMetadataStorage,
    refPointerPrefix: SchemaPrefix,
  });

  const storage: MetadataArgsStorage = getMetadataArgsStorage();

  const swaggerSpec = routingControllersToSpec(storage, { controllers }, {
    info: {
      title: 'Stack Overflow API',
      description: `Swagger documentation for Stack Overflow API ${version}`,
      version,
    },
    components: {
      schemas,
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [{ bearerAuth: [] }],
  });

  return swaggerSpec;
};

export const JsonSchemaArrayRef = (cls: { name: string; }): PropertyDecorator => {
  return JSONSchema({
    items: {
      $ref: `${SchemaPrefix}${cls.name}`,
    },
  }) as PropertyDecorator;
};

/**
 * Function that returns Swagger decorators for summary, request body and response.
 * To be used at controller endpoint level.
 */
export const SwaggerDocs = <TResponseType, TRequestBody = unknown>(params: {
  /** Endpoint summary */
  summary: string;
  /**
   * Indicates if the endpoint requires authentication
   * @default false
   */
  isAuthRequired?: boolean;
  /** Optional parameters */
  parameters?: Array<any>; // TODO: Replace 'any' with a proper type
  /** Optional example of request body */
  requestBodyExample?: TRequestBody;
  /**
   * Status code of a successful response
   * @default 200
   */
  responseStatusCode?: number;
  /** Class of the successful response */
  responseType: { new(): TResponseType; };
  /** Example of a successful response */
  responseExample: TResponseType;
}): MethodDecorator => {
  const {
    summary,
    isAuthRequired = false,
    parameters,
    requestBodyExample,
    responseStatusCode = 200,
    responseType,
    responseExample,
  } = params;

  const securityObj = isAuthRequired
    ? { security: [{ bearerAuth: [] }] }
    : {};

  const parametersObj = parameters
    ? { parameters }
    : {};

  const requestBodyObj = requestBodyExample
    ? {
      requestBody: {
        content: {
          'application/json': {
            example: requestBodyExample,
          }
        }
      },
    }
    : {};

  const responsesObj = {
    responses: {
      [responseStatusCode]: {
        content: {
          'application/json': {
            example: responseExample,
          }
        }
      }
    }
  };

  const swaggerDocs = (target: Object, propertyKey: string | symbol, descriptor: TypedPropertyDescriptor<unknown>) => {
    OpenAPI({
      summary,
      ...securityObj,
      ...parametersObj,
      ...requestBodyObj,
      ...responsesObj,
    })(target, propertyKey as string, descriptor);
    HttpCode(responseStatusCode)(target, propertyKey as string, descriptor);
    ResponseSchema(responseType)(target, propertyKey as string, descriptor);
  };

  return swaggerDocs as MethodDecorator;
};

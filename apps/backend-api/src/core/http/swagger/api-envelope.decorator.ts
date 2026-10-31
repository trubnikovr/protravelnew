import { applyDecorators, type Type } from '@nestjs/common';
import { ApiExtraModels, ApiResponse, getSchemaPath } from '@nestjs/swagger';
import { ApiErrorEnvelopeDto, ApiResponseMetaDto } from './api-envelope.dto';
import { PaginationMetaResponseDto } from '@entrypoints/common/dto/response/pagination-meta.response.dto';

export function ApiOkEnvelope(model: Type<unknown>) {
  return ApiEnvelope(model, 200);
}

export function ApiArrayEnvelope(model: Type<unknown>) {
  return applyDecorators(
    ApiExtraModels(model, ApiResponseMetaDto),
    ApiResponse({
      status: 200,
      schema: {
        type: 'object',
        required: ['data', 'meta'],
        properties: {
          data: { type: 'array', items: { $ref: getSchemaPath(model) } },
          meta: { $ref: getSchemaPath(ApiResponseMetaDto) },
        },
      },
    }),
  );
}

export function ApiPaginatedEnvelope(
  model: Type<unknown>,
  additionalMetaModel?: Type<unknown>,
) {
  return applyDecorators(
    ApiExtraModels(
      model,
      ApiResponseMetaDto,
      PaginationMetaResponseDto,
      ...(additionalMetaModel ? [additionalMetaModel] : []),
    ),
    ApiResponse({
      status: 200,
      schema: {
        type: 'object',
        required: ['data', 'meta'],
        properties: {
          data: { type: 'array', items: { $ref: getSchemaPath(model) } },
          meta: {
            allOf: [
              { $ref: getSchemaPath(ApiResponseMetaDto) },
              {
                type: 'object',
                required: ['pagination'],
                properties: {
                  pagination: {
                    $ref: getSchemaPath(PaginationMetaResponseDto),
                  },
                },
              },
              ...(additionalMetaModel
                ? [{ $ref: getSchemaPath(additionalMetaModel) }]
                : []),
            ],
          },
        },
      },
    }),
  );
}

export function ApiEnvelope(model: Type<unknown>, status: number) {
  return applyDecorators(
    ApiExtraModels(model, ApiResponseMetaDto),
    ApiResponse({
      status,
      schema: {
        type: 'object',
        required: ['data', 'meta'],
        properties: {
          data: { $ref: getSchemaPath(model) },
          meta: { $ref: getSchemaPath(ApiResponseMetaDto) },
        },
      },
    }),
  );
}

export function ApiErrorEnvelope(status: number) {
  return applyDecorators(
    ApiExtraModels(ApiErrorEnvelopeDto),
    ApiResponse({ status, type: ApiErrorEnvelopeDto }),
  );
}

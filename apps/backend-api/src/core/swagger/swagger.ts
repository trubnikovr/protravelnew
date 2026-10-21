import { mkdirSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, OpenAPIObject, SwaggerModule } from '@nestjs/swagger';

const API_VERSIONS = ['1'] as const;
type ApiVersion = (typeof API_VERSIONS)[number];
type ApiAudience = 'mobile' | 'admin';

function createSwaggerConfig(version: ApiVersion) {
  return new DocumentBuilder()
    .setTitle('ProTravel API')
    .setDescription('REST API for ProTravel mobile and admin applications')
    .setVersion(`${version}.0`)
    .addBearerAuth()
    .addApiKey(
      { type: 'apiKey', name: 'Idempotency-Key', in: 'header' },
      'idempotency-key',
    )
    .build();
}

export function createOpenApiDocument(
  app: INestApplication,
  version: ApiVersion = '1',
): OpenAPIObject {
  return SwaggerModule.createDocument(app, createSwaggerConfig(version), {
    operationIdFactory: (controllerKey, methodKey) =>
      `${controllerKey.replace(/Controller$/, '')}_${methodKey}`,
  });
}

function withReferencedSchemas(document: OpenAPIObject): OpenAPIObject {
  const schemas = document.components?.schemas;
  if (!schemas) return document;

  const referenced = new Set<string>();
  const pending: unknown[] = [document.paths];

  while (pending.length > 0) {
    const value = pending.pop();
    if (!value || typeof value !== 'object') continue;

    for (const [key, child] of Object.entries(value)) {
      if (key === '$ref' && typeof child === 'string') {
        const match = child.match(/^#\/components\/schemas\/(.+)$/);
        if (match && !referenced.has(match[1])) {
          referenced.add(match[1]);
          pending.push(schemas[match[1]]);
        }
        continue;
      }
      pending.push(child);
    }
  }

  return {
    ...document,
    components: {
      ...document.components,
      schemas: Object.fromEntries(
        Object.entries(schemas).filter(([name]) => referenced.has(name)),
      ),
    },
  };
}

function withPaths(
  document: OpenAPIObject,
  predicate: (path: string) => boolean,
): OpenAPIObject {
  return {
    ...document,
    paths: Object.fromEntries(
      Object.entries(document.paths).filter(([path]) => predicate(path)),
    ),
  };
}

function saveContract(
  version: ApiVersion,
  audience: ApiAudience,
  document: OpenAPIObject,
): void {
  const outputDirectory = resolve(
    __dirname,
    '../../../../../../packages/api-contract',
  );
  const versionDirectory = resolve(outputDirectory, `v${version}`);
  mkdirSync(versionDirectory, { recursive: true });
  writeFileSync(
    resolve(versionDirectory, `${audience}.openapi.json`),
    `${JSON.stringify(document, null, 2)}\n`,
  );

  // Transitional aliases keep existing local tooling and documentation links
  // working while consumers move to explicit version imports.
  if (version === '1') {
    writeFileSync(
      resolve(outputDirectory, `${audience}.openapi.json`),
      `${JSON.stringify(document, null, 2)}\n`,
    );
  }
}

export function setupSwagger(app: INestApplication, apiPrefix: string): void {
  const routePrefix = apiPrefix.replace(/^\/+|\/+$/g, '');
  const absoluteApiPrefix = `/${routePrefix}`;
  const isAdminPath = (path: string): boolean => /\/admin(?:\/|$)/.test(path);
  const isSharedPath = (path: string): boolean =>
    /\/reference(?:\/|$)/.test(path);
  const documents: Record<
    ApiAudience,
    Partial<Record<ApiVersion, OpenAPIObject>>
  > = { mobile: {}, admin: {} };

  for (const version of API_VERSIONS) {
    const document = createOpenApiDocument(app, version);
    const versionPrefix = `${absoluteApiPrefix}/v${version}/`;
    const versionDocument = withPaths(document, (path) =>
      path.startsWith(versionPrefix),
    );
    const mobileDocument = withReferencedSchemas(
      withPaths(versionDocument, (path) => !isAdminPath(path)),
    );
    const adminDocument = withReferencedSchemas(
      withPaths(
        versionDocument,
        (path) => isAdminPath(path) || isSharedPath(path),
      ),
    );

    for (const [audience, audienceDocument] of [
      ['mobile', mobileDocument],
      ['admin', adminDocument],
    ] as const) {
      documents[audience][version] = audienceDocument;
      SwaggerModule.setup(
        `${routePrefix}/v${version}/${audience}/openapi`,
        app,
        audienceDocument,
        {
          jsonDocumentUrl: `${absoluteApiPrefix}/v${version}/${audience}/openapi.json`,
          raw: ['json'],
          ui: false,
        },
      );
      saveContract(version, audience, audienceDocument);
    }
  }

  for (const audience of ['mobile', 'admin'] as const) {
    const currentDocument = documents[audience]['1'];
    if (!currentDocument) continue;

    SwaggerModule.setup(
      `${routePrefix}/${audience}/docs`,
      app,
      currentDocument,
      {
        explorer: true,
        jsonDocumentUrl: `${absoluteApiPrefix}/${audience}/openapi.json`,
        urls: API_VERSIONS.map((version) => ({
          name: `${audience} v${version}`,
          url: `${absoluteApiPrefix}/v${version}/${audience}/openapi.json`,
        })),
      },
    );
  }
}

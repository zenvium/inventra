# Architecture rules

## domain

`src/checks/domain-layout.ts`, except `imports` in `src/checks/layer-dependencies.ts`.

| Rule | Function |
| --- | --- |
| `contexts.passport` | `contextsPassport` |
| `contexts.barrel` | `contextsBarrel`, `contextsBarrelMissing` |
| `contexts.files` | `contextsFiles` |
| `context.name` | `contextFolderName` |
| `system-passport` | `systemPassports` |
| `context.files` | `contextFiles` |
| `context.permissions` | `contextPermissions` |
| `context.visa` | `contextVisa` |
| `context.passport` | `contextPassport` |
| `context.barrel` | `contextBarrel` |
| `subdomain.name` | `subdomainName` |
| `subdomain.files` | `subdomainFiles` |
| `subdomain.barrel` | `subdomainBarrel` |
| `subdomain.names` | `checkDuplicateClassNames` |
| `aggregate.shape` | `aggregateShape` |
| `aggregate.props` | `aggregateProps` |
| `aggregate.reference` | `aggregateReference` |
| `aggregate.is-new` | `aggregateIsNew` |
| `aggregate.get-new-instance` | `aggregateGetNewInstance` |
| `aggregate.default-instance` | `aggregateDefaultInstance` |
| `aggregate.role-method` | `aggregateRoleMethod` |
| `aggregate.member` | `aggregateMember` |
| `aggregate.setter` | `aggregateSetter` |
| `aggregate.collection` | `aggregateCollection` |
| `aggregate.nested` | `aggregateNested` |
| `repository.shape` | `domainRepositoryShape` |
| `repository.member` | `domainRepositoryMember` |
| `uow.shape` | `domainUnitOfWorkShape` |
| `uow.member` | `domainUnitOfWorkMember` |
| `value-objects.shape` | `valueObjectsShape` |
| `value-objects.body` | `valueObjectsBody`, `nestedStringBody` |
| `value-objects.pattern` | `stringPatternOptions` |
| `nested-value-object.shape` | `nestedValueObjectShape` |
| `nested-value-object.visa` | `nestedValueObjectVisa` |
| `nested-value-object.is-new` | `nestedValueObjectIsNew` |
| `nested-value-object.member` | `nestedValueObjectMember` |
| `nested-value-object.root` | `nestedValueObjectRoot` |
| `entity.shape` | `entityShape` |
| `entity.visa` | `entityVisa` |
| `entity.is-new` | `entityIsNew` |
| `entity.timestamps` | `entityTimestamps` |
| `entity.member` | `entityMember` |
| `entity.root` | `entityRoot` |
| `entity.value-objects` | `entityValueObjects` |
| `is-new` | `checkIsNewOnlyOnAggregate` |
| `role.permissions` | `rolePermissions` |
| `nested.root` | `checkRootWiring` |
| `imports` | `domainImports` |

## persistence

`src/checks/persistence-layout.ts`.

| Rule | Function |
| --- | --- |
| `domain.index` | `persistenceDomainIndex` |
| `context.name` | `persistenceContextName` |
| `context.files` | `persistenceContextFiles` |
| `context.factory` | `persistenceContextFactory` |
| `subdomain.name` | `persistenceSubdomainName` |
| `subdomain.files` | `persistenceSubdomainFiles` |
| `subdomain.barrel` | `persistenceSubdomainBarrel` |
| `subdomain.factory` | `persistenceSubdomainFactory` |
| `adapter.shape` | `adapterShape` |
| `adapter.doc` | `adapterDoc` |
| `adapter.member` | `adapterMember` |
| `adapter.nested` | `adapterNested` |
| `repository.shape` | `repositoryShape` |
| `repository.methods` | `repositoryMethods` |
| `repository.missing` | `repositoryMissing` |
| `repository.helper` | `repositoryHelper` |
| `repository.save` | `repositorySave` |
| `uow.shape` | `persistenceUnitOfWorkShape` |
| `readonly.files` | `readonlyRootFiles`, `readonlySubdomainFiles` |
| `readonly.index` | `readonlyIndex` |
| `readonly.context` | `readonlyContext` |
| `readonly.data` | `readonlyData` |
| `readonly.repository` | `readonlyRepository` |
| `readonly.missing` | `readonlyMissing` |
| `readonly.barrel` | `readonlyBarrel` |

## application

`src/checks/application-services-layout.ts`, except `imports` in `src/checks/layer-dependencies.ts`.

| Rule | Function |
| --- | --- |
| `index` | `applicationIndex` |
| `context.name` | `applicationContextName` |
| `context.files` | `applicationContextFiles` |
| `context.factory` | `applicationContextFactory` |
| `subdomain.name` | `applicationSubdomainName` |
| `subdomain.files` | `applicationSubdomainFiles` |
| `subdomain.factory` | `applicationSubdomainFactory` |
| `action.name` | `actionFileName`, `actionName` |
| `action.function` | `actionFunction` |
| `action.shape` | `actionShape` |
| `imports` | `applicationImports` |

## models

`src/checks/models-layout.ts`.

| Rule | Function |
| --- | --- |
| `index` | `modelIndexMissing`, `modelIndexRegistration` |
| `subdomain.name` | `modelSubdomainName` |
| `files` | `modelFiles` |
| `schema` | `modelSchema` |
| `schema.pattern` | `schemaPattern` |
| `schema.reference` | `schemaReference` |

## graphql

`src/checks/graphql-layout.ts`.

| Rule | Function |
| --- | --- |
| `files` | `graphqlFiles` |
| `sdl` | `graphqlSdl` |
| `resolvers` | `graphqlResolvers` |

## queue

`src/checks/queue-operations-layout.ts`.

| Rule | Function |
| --- | --- |
| `files` | `queueFiles` |
| `barrel` | `queueBarrel` |
| `shape` | `queueShape` |

## timer

`src/checks/timer-operations-layout.ts`.

| Rule | Function |
| --- | --- |
| `files` | `timerFiles` |
| `barrel` | `timerBarrel` |
| `shape` | `timerShape` |
| `schedule` | `timerSchedule` |

## api

`src/checks/api-composition.ts`.

| Rule | Function |
| --- | --- |
| `composition.target` | `compositionTarget` |
| `composition.file` | `compositionFile` |
| `composition.handler` | `handlerRegistration` |

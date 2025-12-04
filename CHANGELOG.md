# Changelog

## [2.22.0](https://git.knut.univention.de/univention/dev/projects/intercom-service/compare/v2.21.1...v2.22.0) (2025-12-04)


### Features

* Bump AppCenter compose image ([3feff3c](https://git.knut.univention.de/univention/dev/projects/intercom-service/commit/3feff3c5594ef8b16ac8ae99d90f1347a22dde78)), closes [univention/dev/internal/team-nubus#1538](https://git.knut.univention.de/univention/dev/internal/team-nubus/issues/1538)
* Security bump for Redis ([107bc2f](https://git.knut.univention.de/univention/dev/projects/intercom-service/commit/107bc2fa19c7bb874a37c079eea751476cee0183)), closes [univention/dev/internal/team-nubus#1538](https://git.knut.univention.de/univention/dev/internal/team-nubus/issues/1538)


### Bug Fixes

* compose file boolean needs to be string ([b07a11f](https://git.knut.univention.de/univention/dev/projects/intercom-service/commit/b07a11fcdd580abd80e66a3967169d275ced3875)), closes [univention/dev/internal/team-nubus#1538](https://git.knut.univention.de/univention/dev/internal/team-nubus/issues/1538)

## [2.21.1](https://git.knut.univention.de/univention/dev/projects/intercom-service/compare/v2.21.0...v2.21.1) (2025-12-03)


### Bug Fixes

* bump image to errata 298 ([da49bf8](https://git.knut.univention.de/univention/dev/projects/intercom-service/commit/da49bf8056c5dde7132c2aadd49fa14b6c61dd5a)), closes [univention/dev/internal/team-nubus#1543](https://git.knut.univention.de/univention/dev/internal/team-nubus/issues/1543)

## [2.21.0](https://git.knut.univention.de/univention/dev/projects/intercom-service/compare/v2.20.1...v2.21.0) (2025-11-28)


### Features

* use prod Dependency-Track URLs ([5f179c7](https://git.knut.univention.de/univention/dev/projects/intercom-service/commit/5f179c7ef2050c08b115a4f6cca54b12f3715d23)), closes [univention/dev/internal/team-nubus#1512](https://git.knut.univention.de/univention/dev/internal/team-nubus/issues/1512)


### Bug Fixes

* ci: vul-man SBOM upload cleans tag before uploading new SBOMs for a tag ([c6b4235](https://git.knut.univention.de/univention/dev/projects/intercom-service/commit/c6b423565a30d117bef8626aef2b4888912106e4)), closes [univention/dev/internal/team-nubus#1529](https://git.knut.univention.de/univention/dev/internal/team-nubus/issues/1529)
* **ci:** Bump common-ci ([a49bdc4](https://git.knut.univention.de/univention/dev/projects/intercom-service/commit/a49bdc4cb4efdbf2a3c5411bf67ee04a62a51a19)), closes [univention/dev/internal/team-nubus#1532](https://git.knut.univention.de/univention/dev/internal/team-nubus/issues/1532)
* update dependencies in the values ([59103f9](https://git.knut.univention.de/univention/dev/projects/intercom-service/commit/59103f94ed1e9eb5e5da9e6976d8cb8b9f6370ca)), closes [univention/dev/internal/team-nubus#1476](https://git.knut.univention.de/univention/dev/internal/team-nubus/issues/1476)

## [2.20.1](https://git.knut.univention.de/univention/dev/projects/intercom-service/compare/v2.20.0...v2.20.1) (2025-11-11)


### Bug Fixes

* Update vul-man CI Component to integrate the validate-vex job ([54132ee](https://git.knut.univention.de/univention/dev/projects/intercom-service/commit/54132ee331810120e63824239915da34820ef672)), closes [univention/dev/internal/team-nubus#1469](https://git.knut.univention.de/univention/dev/internal/team-nubus/issues/1469)
* **vul-man:** Fix validate-vex on main when no MR is linked to the pipeline ([60681d1](https://git.knut.univention.de/univention/dev/projects/intercom-service/commit/60681d118b93d03e4b20e36251190197ef181148)), closes [univention/dev/internal/team-nubus#1469](https://git.knut.univention.de/univention/dev/internal/team-nubus/issues/1469)

## [2.20.0](https://git.knut.univention.de/univention/dev/projects/intercom-service/compare/v2.19.6...v2.20.0) (2025-11-04)


### Features

* use vul-man component to attest SBOM and VEX on images ([21a48e7](https://git.knut.univention.de/univention/dev/projects/intercom-service/commit/21a48e70f8966dc8a3681dff89925d5b70619661)), closes [univention/dev/internal/team-nubus#1468](https://git.knut.univention.de/univention/dev/internal/team-nubus/issues/1468)

## [2.19.6](https://git.knut.univention.de/univention/dev/projects/intercom-service/compare/v2.19.5...v2.19.6) (2025-09-11)


### Bug Fixes

* **deps:** Update artifacts.software-univention.de/nubus/images/wait-for-dependency Docker tag to v0.35.6 ([d1c345b](https://git.knut.univention.de/univention/dev/projects/intercom-service/commit/d1c345b281a4b832d316688595c54a14783aab83)), closes [#0](https://git.knut.univention.de/univention/dev/projects/intercom-service/issues/0)

## [2.19.5](https://git.knut.univention.de/univention/dev/projects/intercom-service/compare/v2.19.4...v2.19.5) (2025-09-05)


### Bug Fixes

* **deps:** Update artifacts.software-univention.de/nubus/images/wait-for-dependency Docker tag to v0.35.4 ([2b8b42a](https://git.knut.univention.de/univention/dev/projects/intercom-service/commit/2b8b42a985e669bb243de3ec1cd0b8ed99c46970)), closes [#0](https://git.knut.univention.de/univention/dev/projects/intercom-service/issues/0)

## [2.19.4](https://git.knut.univention.de/univention/dev/projects/intercom-service/compare/v2.19.3...v2.19.4) (2025-09-05)


### Bug Fixes

* **deps:** Update gitregistry.knut.univention.de/univention/dev/projects/ucs-base-image/ucs-base Docker tag to v5.2.2-build.20250828 ([f2e9a6b](https://git.knut.univention.de/univention/dev/projects/intercom-service/commit/f2e9a6b71efcd1a50fba17d31487d979d733df93)), closes [#0](https://git.knut.univention.de/univention/dev/projects/intercom-service/issues/0)

## [2.19.3](https://git.knut.univention.de/univention/dev/projects/intercom-service/compare/v2.19.2...v2.19.3) (2025-08-29)


### Bug Fixes

* **deps:** Update dependency univention/dev/nubus-for-k8s/common-ci to v1.44.2 ([3008921](https://git.knut.univention.de/univention/dev/projects/intercom-service/commit/3008921fe16c6f73ed19f5a783d21d2cd1f2b6e4)), closes [#0](https://git.knut.univention.de/univention/dev/projects/intercom-service/issues/0)

## [2.19.2](https://git.knut.univention.de/univention/dev/projects/intercom-service/compare/v2.19.1...v2.19.2) (2025-08-29)


### Bug Fixes

* Update base image to version 5.2.2-build.20250821 ([752a738](https://git.knut.univention.de/univention/dev/projects/intercom-service/commit/752a7380d52c9e21efb5abb9578049e329526288)), closes [univention/dev/internal/team-nubus#1385](https://git.knut.univention.de/univention/dev/internal/team-nubus/issues/1385)

## [2.19.1](https://git.knut.univention.de/univention/dev/projects/intercom-service/compare/v2.19.0...v2.19.1) (2025-08-19)


### Bug Fixes

* **deps:** Update gitregistry.knut.univention.de/univention/dev/projects/ucs-base-image/ucs-base Docker tag to v5.2.2-build.20250814 ([7dfb490](https://git.knut.univention.de/univention/dev/projects/intercom-service/commit/7dfb4901d03ee89bc440f7d0c960108604a04878)), closes [#0](https://git.knut.univention.de/univention/dev/projects/intercom-service/issues/0)

## [2.19.0](https://git.knut.univention.de/univention/dev/projects/intercom-service/compare/v2.18.0...v2.19.0) (2025-07-31)


### Features

* Bump express-openid-connect ([e3f860a](https://git.knut.univention.de/univention/dev/projects/intercom-service/commit/e3f860a6ffa5ccc715155fa6634eab4ac2cef688)), closes [univention/dev/internal/team-nubus#1359](https://git.knut.univention.de/univention/dev/internal/team-nubus/issues/1359)
* Enable Standard Token Exchange for Keycloak 26.2 onwards ([2692218](https://git.knut.univention.de/univention/dev/projects/intercom-service/commit/2692218a2e8d2e3c3fb296990cb3067e0a8b5550)), closes [univention/dev/internal/team-nubus#1359](https://git.knut.univention.de/univention/dev/internal/team-nubus/issues/1359)


### Bug Fixes

* Keycloak provisioning values ([c79ee7a](https://git.knut.univention.de/univention/dev/projects/intercom-service/commit/c79ee7a95d10f93ce549c38ca444b7beaf1c5a7b)), closes [univention/dev/internal/team-nubus#1359](https://git.knut.univention.de/univention/dev/internal/team-nubus/issues/1359)
* Matrix token is not JWT so it is always fetched from scratch ([7c002c0](https://git.knut.univention.de/univention/dev/projects/intercom-service/commit/7c002c07e1275ba1927963e7531e30d99d39948e)), closes [univention/dev/internal/team-nubus#1359](https://git.knut.univention.de/univention/dev/internal/team-nubus/issues/1359)

## [2.18.0](https://git.knut.univention.de/univention/dev/projects/intercom-service/compare/v2.17.0...v2.18.0) (2025-07-17)


### Features

* update keycloak-bootstrap image tag to 0.14.0 ([4a917a7](https://git.knut.univention.de/univention/dev/projects/intercom-service/commit/4a917a78acc5362d03a253efc7834d1df44f8ce4)), closes [univention/dev/internal/team-nubus#1320](https://git.knut.univention.de/univention/dev/internal/team-nubus/issues/1320)
* update wait-for-dependency to 0.35.0 ([01c8a35](https://git.knut.univention.de/univention/dev/projects/intercom-service/commit/01c8a359b596e8541de3146aa3e9069fd2b39c43)), closes [univention/dev/internal/team-nubus#1320](https://git.knut.univention.de/univention/dev/internal/team-nubus/issues/1320)

## [2.17.0](https://git.knut.univention.de/univention/dev/projects/intercom-service/compare/v2.16.2...v2.17.0) (2025-07-17)


### Features

* update ucs-base to 5.2.2-build.20250714 ([61cd74d](https://git.knut.univention.de/univention/dev/projects/intercom-service/commit/61cd74d40eb2e339d77dc984643aa601b39119cb)), closes [univention/dev/internal/team-nubus#1320](https://git.knut.univention.de/univention/dev/internal/team-nubus/issues/1320)

## [2.16.2](https://git.knut.univention.de/univention/dev/projects/intercom-service/compare/v2.16.1...v2.16.2) (2025-06-23)


### Bug Fixes

* use default cluster ingress class if not defined ([b0e8499](https://git.knut.univention.de/univention/dev/projects/intercom-service/commit/b0e8499fefd5cdd56c277b897783578c17241d66)), closes [univention/dev/internal/team-nubus#1134](https://git.knut.univention.de/univention/dev/internal/team-nubus/issues/1134)

## [2.16.1](https://git.knut.univention.de/univention/dev/projects/intercom-service/compare/v2.16.0...v2.16.1) (2025-06-21)


### Bug Fixes

* bump umc-base-image version ([10bcc90](https://git.knut.univention.de/univention/dev/projects/intercom-service/commit/10bcc907531485d9046256f384c8259f02686219)), closes [univention/dev/internal/team-nubus#1263](https://git.knut.univention.de/univention/dev/internal/team-nubus/issues/1263)

## [2.16.0](https://git.knut.univention.de/univention/dev/projects/intercom-service/compare/v2.15.0...v2.16.0) (2025-06-18)


### Features

* update ucs-base-image 522 ([9a1bdfe](https://git.knut.univention.de/univention/dev/projects/intercom-service/commit/9a1bdfeb19b03b1f8cfe87b61906b1c11cc147c3)), closes [#0](https://git.knut.univention.de/univention/dev/projects/intercom-service/issues/0)

## [2.15.0](https://git.knut.univention.de/univention/dev/projects/intercom-service/compare/v2.14.1...v2.15.0) (2025-05-11)


### Features

* move and upgrade ucs-base-image to 0.17.3-build-2025-05-11 ([f7690aa](https://git.knut.univention.de/univention/dev/projects/intercom-service/commit/f7690aa88ce9f31c4bd18472d18ed87ea0954083))

## [2.14.1](https://git.knut.univention.de/univention/dev/projects/intercom-service/compare/v2.14.0...v2.14.1) (2025-05-10)


### Bug Fixes

* move addlicense pre-commit hook ([efc8aee](https://git.knut.univention.de/univention/dev/projects/intercom-service/commit/efc8aee304b6e3da38bfffd7af180ced30d41134))
* update common-ci to main ([6f0b184](https://git.knut.univention.de/univention/dev/projects/intercom-service/commit/6f0b184c1360b52c14eef720130a49035290a07e))

## [2.14.0](https://git.knut.univention.de/univention/components/intercom-service/compare/v2.13.0...v2.14.0) (2025-04-29)


### Features

* Bump ucs-base-image version ([7489f6d](https://git.knut.univention.de/univention/components/intercom-service/commit/7489f6d83a8a78bf06d9b71637b06d3dd7b151ea)), closes [univention/dev/internal/team-nubus#1155](https://git.knut.univention.de/univention/dev/internal/team-nubus/issues/1155)


### Bug Fixes

* final version of wait-for-dependency and keycloak-bootstrap ([b7a34e9](https://git.knut.univention.de/univention/components/intercom-service/commit/b7a34e90aaa44a8966fd20e87d967664bc76fde5)), closes [univention/dev/internal/team-nubus#1155](https://git.knut.univention.de/univention/dev/internal/team-nubus/issues/1155)

## [2.13.0](https://git.knut.univention.de/univention/components/intercom-service/compare/v2.12.1...v2.13.0) (2025-04-16)


### Features

* **helm:** Secrets refactor ([6d45706](https://git.knut.univention.de/univention/components/intercom-service/commit/6d45706407cd9a5aca2b1f9befcd0233831d2b7a)), closes [univention/dev/internal/team-nubus#1095](https://git.knut.univention.de/univention/dev/internal/team-nubus/issues/1095)

## [2.12.1](https://git.knut.univention.de/univention/components/intercom-service/compare/v2.12.0...v2.12.1) (2025-03-21)


### Bug Fixes

* namespace template in serviceacount ([4e50249](https://git.knut.univention.de/univention/components/intercom-service/commit/4e50249b7a40ae27908ab1d8819fa9791ed5985a)), closes [univention/dev/internal/team-nubus#1075](https://git.knut.univention.de/univention/dev/internal/team-nubus/issues/1075)

## [2.12.0](https://git.knut.univention.de/univention/components/intercom-service/compare/v2.11.0...v2.12.0) (2025-03-06)


### Features

* **intercom:** Allow transient session cookies and rolling session duration configuration ([82b90c4](https://git.knut.univention.de/univention/components/intercom-service/commit/82b90c419493f6608bfa60e3af23f0d6771a8905))

## [2.11.0](https://git.knut.univention.de/univention/components/intercom-service/compare/v2.10.3...v2.11.0) (2025-02-26)


### Features

* Bump ucs-base-image to use released apt sources ([a20d6c2](https://git.knut.univention.de/univention/components/intercom-service/commit/a20d6c2f965a369d46ff830664b50e043768cf40))

## [2.10.3](https://git.knut.univention.de/univention/components/intercom-service/compare/v2.10.2...v2.10.3) (2025-02-10)


### Bug Fixes

* add .kyverno to helmignore ([3dc645c](https://git.knut.univention.de/univention/components/intercom-service/commit/3dc645c8b2b630207505eaf23fe4756a1cc91bae))

## [2.10.2](https://git.knut.univention.de/univention/components/intercom-service/compare/v2.10.1...v2.10.2) (2025-01-24)


### Bug Fixes

* **intercom:** Fix release date and AppCenter compose version ([f60acfa](https://git.knut.univention.de/univention/components/intercom-service/commit/f60acfacd39475d1af191cc69fec8617fae808f4))

## [2.10.1](https://git.knut.univention.de/univention/components/intercom-service/compare/v2.10.0...v2.10.1) (2025-01-24)


### Bug Fixes

* **intercom:** docker-compose UCR template failed on UCS 5.0 ([a3d324f](https://git.knut.univention.de/univention/components/intercom-service/commit/a3d324f6e1607f66c60718b2845038403711e4cd))

## [2.10.0](https://git.knut.univention.de/univention/components/intercom-service/compare/v2.9.0...v2.10.0) (2025-01-24)


### Features

* **intercom:** appcenter version including redis SSL ([6e6d41b](https://git.knut.univention.de/univention/components/intercom-service/commit/6e6d41bbd7a2f49bef359a00a07b4ce1a1f6d2b5))

## [2.9.0](https://git.knut.univention.de/univention/components/intercom-service/compare/v2.8.0...v2.9.0) (2025-01-22)


### Features

* **intercom:** Version bump ([dfa2fe4](https://git.knut.univention.de/univention/components/intercom-service/commit/dfa2fe4f65fd116816ae97089e6d76425487eea0))


### Bug Fixes

* **intercom:** Better logging in proxy middlewares ([b3ae829](https://git.knut.univention.de/univention/components/intercom-service/commit/b3ae8294af8094d86e8a8bdfc56fe6bacf4c01bb))
* **intercom:** Move activating and deactivating extensions logic to ICS ([e65fc24](https://git.knut.univention.de/univention/components/intercom-service/commit/e65fc241ce30550274908bca0e3078345e8dfc71))
* **intercom:** Retry access token fetching if missing in user session but integration enabled ([9096edd](https://git.knut.univention.de/univention/components/intercom-service/commit/9096edd9da10dc534f115b3d67fe402053a744fd))
* **intercom:** token renewal for matrix and nextcloud ([d8ab47c](https://git.knut.univention.de/univention/components/intercom-service/commit/d8ab47c02a6c8ad048941cd6d8092ca1f99b631f))
* removed wrong helm template, added redis tls support to changelog ([a883d17](https://git.knut.univention.de/univention/components/intercom-service/commit/a883d171127b6cea279dd98feb74b42b58484ced))

## [2.8.0](https://git.knut.univention.de/univention/components/intercom-service/compare/v2.7.3...v2.8.0) (2024-12-20)


### Features

* upgrade UCS base image to 2024-12-12 ([3a97a4e](https://git.knut.univention.de/univention/components/intercom-service/commit/3a97a4e484024ac272c4d9f6280ebc22b74cf97f))

## [2.7.3](https://git.knut.univention.de/univention/components/intercom-service/compare/v2.7.2...v2.7.3) (2024-12-18)


### Bug Fixes

* switch enabled flags from string to booleans ([c45ef9e](https://git.knut.univention.de/univention/components/intercom-service/commit/c45ef9e0640b338ecccef1bc62f7182ee497b304))

## [2.7.2](https://git.knut.univention.de/univention/components/intercom-service/compare/v2.7.1...v2.7.2) (2024-12-17)


### Bug Fixes

* added support for external client secret ([b21e8b0](https://git.knut.univention.de/univention/components/intercom-service/commit/b21e8b0c1cdb220122c832c5ebec711cad7a456f))

## [2.7.1](https://git.knut.univention.de/univention/components/intercom-service/compare/v2.7.0...v2.7.1) (2024-12-16)


### Bug Fixes

* disable provisioning init containers if provisioning is disable ([50d7054](https://git.knut.univention.de/univention/components/intercom-service/commit/50d705487578558eba35f5406dc0f6c08ae617d9))
* fix resources indentation in initContainers ([d920ec0](https://git.knut.univention.de/univention/components/intercom-service/commit/d920ec04cd8f566bc67ab07edab600d357a269f2))
* qa fix ([7558f52](https://git.knut.univention.de/univention/components/intercom-service/commit/7558f52e51143847e6e4780acb27682af63b8dcf))

## [2.7.0](https://git.knut.univention.de/univention/components/intercom-service/compare/v2.6.0...v2.7.0) (2024-12-16)


### Features

* added ssl support for redis ([baca4ce](https://git.knut.univention.de/univention/components/intercom-service/commit/baca4ce7cf8c4ca60fd2393e857b80d2fd108f64))

## [2.6.0](https://git.knut.univention.de/univention/components/intercom-service/compare/v2.5.0...v2.6.0) (2024-12-12)


### Features

* **appcenter:** Set AppCenter image to released artifact ([aabc68d](https://git.knut.univention.de/univention/components/intercom-service/commit/aabc68db754d12505398226a445f468f2fc1bcca))

## [2.5.0](https://git.knut.univention.de/univention/components/intercom-service/compare/v2.4.5...v2.5.0) (2024-12-12)


### Features

* **intercom:** Add support for XWiki ([d7be5fd](https://git.knut.univention.de/univention/components/intercom-service/commit/d7be5fd2c00c97199083593f1f15686633331a37))
* **intercom:** Customizable username claim and ensure integrations are optional ([a200ffc](https://git.knut.univention.de/univention/components/intercom-service/commit/a200ffc06586c8bf3d832bb67459ccebfe51b799))
* **intercom:** Read all configuration values only once during startup to avoid synchronous reads ([8476b99](https://git.knut.univention.de/univention/components/intercom-service/commit/8476b99c867874d6767a291f3858de1c959df264))
* **intercom:** Use latest december 2024 ucs-base-image build ([ac06ab9](https://git.knut.univention.de/univention/components/intercom-service/commit/ac06ab9da70c8c88116ad0199538f7f698321edc))
* **intercom:** Version bump to 1.8 ([64a3f26](https://git.knut.univention.de/univention/components/intercom-service/commit/64a3f260f6140e4751f18e337e503b60ea95ad1e))


### Bug Fixes

* **intercom:** Helm Chart documentation and missing values ([382fcb1](https://git.knut.univention.de/univention/components/intercom-service/commit/382fcb10c3583e5ae39fbb5a5eb2723c5c7b1bb0))

## [2.4.5](https://git.knut.univention.de/univention/components/intercom-service/compare/v2.4.4...v2.4.5) (2024-12-10)


### Bug Fixes

* kyverno lint for intercom-service ([eb6ac88](https://git.knut.univention.de/univention/components/intercom-service/commit/eb6ac881ae56b17324bb5cb2de1d4586e9636b9a))

## [2.4.4](https://git.knut.univention.de/univention/components/intercom-service/compare/v2.4.3...v2.4.4) (2024-11-27)


### Bug Fixes

* kyverno lint ([11ffd1c](https://git.knut.univention.de/univention/components/intercom-service/commit/11ffd1c267b3458c5f5082a7ea21f3b267677a33))

## [2.4.3](https://git.knut.univention.de/univention/components/intercom-service/compare/v2.4.2...v2.4.3) (2024-11-18)


### Bug Fixes

* **docs:** target build version for documentation ([d4e0ec1](https://git.knut.univention.de/univention/components/intercom-service/commit/d4e0ec1172f7633a54917fddd5c7ceeb6f0b4bfb))

## [2.4.2](https://git.knut.univention.de/univention/components/intercom-service/compare/v2.4.1...v2.4.2) (2024-11-14)


### Bug Fixes

* **appcenter:** bump AppCenter docker image ([f3cdc09](https://git.knut.univention.de/univention/components/intercom-service/commit/f3cdc096c148acd71bbeb80ec22228aa462858db))

## [2.4.1](https://git.knut.univention.de/univention/components/intercom-service/compare/v2.4.0...v2.4.1) (2024-11-13)


### Bug Fixes

* middleware order in fs path ([8c364e2](https://git.knut.univention.de/univention/components/intercom-service/commit/8c364e2baddb1239e7915b0ad575783850e425c8))

## [2.4.0](https://git.knut.univention.de/univention/components/intercom-service/compare/v2.3.0...v2.4.0) (2024-10-09)


### Features

* **intercom:** make unique claim key customizable ([da547f5](https://git.knut.univention.de/univention/components/intercom-service/commit/da547f5b0ff41d3fd130101bb3010c0942175464)), closes [univention/customers/dataport/team-souvap#875](https://git.knut.univention.de/univention/customers/dataport/team-souvap/issues/875)

## [2.3.0](https://git.knut.univention.de/univention/components/intercom-service/compare/v2.2.0...v2.3.0) (2024-09-26)


### Features

* **ci:** enable malware scanning, disable sbom generation ([2ffcbd6](https://git.knut.univention.de/univention/components/intercom-service/commit/2ffcbd6325cc98ba14586c25d4b8916c96e52e24))

## [2.2.0](https://git.knut.univention.de/univention/components/intercom-service/compare/v2.1.1...v2.2.0) (2024-09-13)


### Features

* update UCS base image to 2024-09-09 ([0847b5b](https://git.knut.univention.de/univention/components/intercom-service/commit/0847b5ba463fd073980f80800d0cd7db6df4814d))
* upgrade wait-for-dependency ([4f8a030](https://git.knut.univention.de/univention/components/intercom-service/commit/4f8a030aa6d6f4dfa6276d9449898c97bd6df76f))

## [2.1.1](https://git.knut.univention.de/univention/components/intercom-service/compare/v2.1.0...v2.1.1) (2024-09-04)


### Bug Fixes

* **ci:** bump version ([8bc4483](https://git.knut.univention.de/univention/components/intercom-service/commit/8bc4483057a8cf5f135007dcfc47cb109765e6b6))

## [0.8.1](https://git.knut.univention.de/univention/components/intercom-service/compare/v0.8.0...v0.8.1) (2024-09-03)


### Bug Fixes

* fix kc init race condition ([41eb103](https://git.knut.univention.de/univention/components/intercom-service/commit/41eb103915c717194d701107db5eb262a895f1b5))

## [0.8.0](https://git.knut.univention.de/univention/components/intercom-service/compare/v0.7.0...v0.8.0) (2024-08-16)


### Features

* added initContainer for Keycloak boostraping ([120f73f](https://git.knut.univention.de/univention/components/intercom-service/commit/120f73feda24cf451b575ce857aa1e1eb3a605d1))

## [0.7.0](https://git.knut.univention.de/univention/components/intercom-service/compare/v0.6.0...v0.7.0) (2024-06-27)


### Features

* **helm/intercom-service:** Add extraVolumes and extraVolumeMounts option ([4887e51](https://git.knut.univention.de/univention/components/intercom-service/commit/4887e51783e3f4b38b6cdc0edc8b2f4c4fdb0a47))

## [0.6.0](https://git.knut.univention.de/univention/components/intercom-service/compare/v0.5.0...v0.6.0) (2024-05-27)


### Features

* add helm chart ([7e98068](https://git.knut.univention.de/univention/components/intercom-service/commit/7e98068ea2ad48bce4e8822af413297946c2485f))


### Bug Fixes

* update pre-commit configuration ([0a3c2c4](https://git.knut.univention.de/univention/components/intercom-service/commit/0a3c2c40eb59633fc1e58c873dec0be0f7f2a585))

## [0.5.0](https://git.knut.univention.de/univention/components/intercom-service/compare/v0.4.0...v0.5.0) (2024-05-23)


### Features

* push to harbor ([27db2a7](https://git.knut.univention.de/univention/components/intercom-service/commit/27db2a7c285f4973300e87a33b8aa937c366eeef))

## [0.4.0](https://git.knut.univention.de/univention/components/intercom-service/compare/v0.3.0...v0.4.0) (2024-04-22)


### Features

* **appcenter:** ShopURL update ([65a1f4d](https://git.knut.univention.de/univention/components/intercom-service/commit/65a1f4dc30c1b43661d7972e3ae70851d18b7d85))

## [0.3.0](https://git.knut.univention.de/univention/components/intercom-service/compare/v0.2.0...v0.3.0) (2024-04-19)


### Features

* **appcenter:** add files before executing jenkins tests ([7f14db0](https://git.knut.univention.de/univention/components/intercom-service/commit/7f14db06403705696bebd211f618cd0c4289f1d3))


### Bug Fixes

* **appcenter:** missing ShopURL field ([0a8edf3](https://git.knut.univention.de/univention/components/intercom-service/commit/0a8edf37105537a830ddad0e2feb10d2826e5749))

## [0.2.0](https://git.knut.univention.de/univention/components/intercom-service/compare/v0.1.1...v0.2.0) (2024-04-09)


### Features

* **intercom:** make redis configurable as a external service ([fa6d24e](https://git.knut.univention.de/univention/components/intercom-service/commit/fa6d24edbaf92b4e34d43a10abee46a86cd38c7e))


### Bug Fixes

* **docs:** drop unused files ([4760347](https://git.knut.univention.de/univention/components/intercom-service/commit/4760347d834178a4fad2d60aaebafed70b45a992))
* **intercom:** copyright headers ([6a857ac](https://git.knut.univention.de/univention/components/intercom-service/commit/6a857ac2c2fc758705f202a90115142d8ed6ed11))

## [0.1.1](https://git.knut.univention.de/univention/components/intercom-service/compare/v0.1.0...v0.1.1) (2024-02-15)


### Bug Fixes

* **debian:** update debian packages ([7f9e094](https://git.knut.univention.de/univention/components/intercom-service/commit/7f9e09488a44281d3fbdab1aaf7e01ed39a66b4d))

## [0.1.0](https://git.knut.univention.de/univention/components/intercom-service/compare/v0.0.6...v0.1.0) (2024-02-09)


### Features

* **ci:** add debian-update-check and fix context ([eb24ca9](https://git.knut.univention.de/univention/components/intercom-service/commit/eb24ca914be3eda83b5937ffa037d3d3c7b395ab))


### Bug Fixes

* **deps:** add renovate.json ([a8cc691](https://git.knut.univention.de/univention/components/intercom-service/commit/a8cc6918979060856a5653fa4749b36fd77d9119))
* **docker:** remove version-pinning for apt-get ([d00309f](https://git.knut.univention.de/univention/components/intercom-service/commit/d00309f5a18c42857101515396c6260d7aef4ee2))

## [0.0.6](https://git.knut.univention.de/univention/components/intercom-service/compare/v0.0.5...v0.0.6) (2023-12-28)


### Bug Fixes

* **ci:** make trigger-docs non-blocking ([8c1588a](https://git.knut.univention.de/univention/components/intercom-service/commit/8c1588ab20ac72e1c4758fe663f3cf45194a6b7f))
* **licensing/ci:** add spdx license headers, add license header checking pre-commit ([02e6114](https://git.knut.univention.de/univention/components/intercom-service/commit/02e61145b8eb8f722735bb770db0725c39781897))

## [0.0.5](https://git.knut.univention.de/univention/components/intercom-service/compare/v0.0.4...v0.0.5) (2023-12-20)


### Bug Fixes

* **docker:** update ucs-base 5.2-0 from v0.7.5 ro v0.10.0 ([d5beebf](https://git.knut.univention.de/univention/components/intercom-service/commit/d5beebf45bf8dd43097c65ec1718666f055242c6))

## [0.0.4](https://git.knut.univention.de/univention/components/intercom-service/compare/v0.0.3...v0.0.4) (2023-12-13)


### Bug Fixes

* **ci:** fix move variables to where they are expected by docs/conf.py ([27facdd](https://git.knut.univention.de/univention/components/intercom-service/commit/27facdd0d1f38af6b5d8099c7d9a198466b6a191))

## [0.0.3](https://git.knut.univention.de/univention/components/intercom-service/compare/v0.0.2...v0.0.3) (2023-12-13)


### Bug Fixes

* **ci:** fixed stages for docs jobs ([058e070](https://git.knut.univention.de/univention/components/intercom-service/commit/058e07001b49e8f684ac3ce59ec2b6f6dbe1ede2))

## [0.0.2](https://git.knut.univention.de/univention/components/intercom-service/compare/v0.0.1...v0.0.2) (2023-12-08)


### Bug Fixes

* **ci:** reference common-ci v1.11.0 to push sbom and signature to souvap ([d1f74ef](https://git.knut.univention.de/univention/components/intercom-service/commit/d1f74ef1ac50a117f30f20a000362d79a3d2385f))

## 0.0.1 (2023-11-30)


### Features

* add settings descriptions ([5cbd381](https://git.knut.univention.de/univention/components/intercom-service/commit/5cbd3813cf65601e6b8a0dfd81bbf19c99d39f10))
* add svg files for pictures ([dfe507d](https://git.knut.univention.de/univention/components/intercom-service/commit/dfe507d3b3b5f88d151368266b9bdd7c1521db1a))
* added ini file ([00f5306](https://git.knut.univention.de/univention/components/intercom-service/commit/00f53067e301e9378b86f246aa26769d3f4db4aa))
* **appcenter:** pass ucr nextcloud audience variable to container ([ba3341f](https://git.knut.univention.de/univention/components/intercom-service/commit/ba3341f158dfec529d334a56a606c86190427ecb))
* architecture docs ([e09450e](https://git.knut.univention.de/univention/components/intercom-service/commit/e09450ec46690bc9456a9b836a30706bcceca70d))
* **ci:** Automate docker image ([ba98463](https://git.knut.univention.de/univention/components/intercom-service/commit/ba98463db0fb667e19909f97136a62bca8cdbae3))
* compose variables updated ([3811165](https://git.knut.univention.de/univention/components/intercom-service/commit/3811165d93d738f456a6c0caa151e9f8979025f3))
* create intercom secret ([ee7e7f4](https://git.knut.univention.de/univention/components/intercom-service/commit/ee7e7f4885d76a3ba629c21aaa64fa8136cf18a8))
* created config file ([834d3ca](https://git.knut.univention.de/univention/components/intercom-service/commit/834d3ca0cd736be04a522db487a1218fe7949349))
* define-qa-steps ([efa9f7b](https://git.knut.univention.de/univention/components/intercom-service/commit/efa9f7b1a8d77a3b77b6a45221f5e20ae2e96a77))
* **dev-env:** Tiltfile for easier development and documentation ([40a72d4](https://git.knut.univention.de/univention/components/intercom-service/commit/40a72d4524ba6eaacf97c7e53ccaebd699f20fad))
* docker image same as app version and public ([389e6db](https://git.knut.univention.de/univention/components/intercom-service/commit/389e6dbf0e0bdad777bc525bc9c84e3664125a86))
* **docker:** base image on ucs-base-520:v.0.7.5 ([564b7b7](https://git.knut.univention.de/univention/components/intercom-service/commit/564b7b749df2111507e1055058680b89330bcabe))
* enable path rewrite for navigation ([cf13afb](https://git.knut.univention.de/univention/components/intercom-service/commit/cf13afbc58f14170c7d3d2e89c9cedfbaff33a4d))
* implment logout & session management ([89ee75b](https://git.knut.univention.de/univention/components/intercom-service/commit/89ee75b7089779d73f1c7a1df2889ad9cd4dd973))
* initial values ([92a92bf](https://git.knut.univention.de/univention/components/intercom-service/commit/92a92bff468b6faab77ad4f97c661df64233d407))
* **intercom:** migrate image to ucs-base and minor log improvements ([6a06c91](https://git.knut.univention.de/univention/components/intercom-service/commit/6a06c9124af3ccdcf56bc0844934e1ed14ba8507))
* new documentation ([14c4efd](https://git.knut.univention.de/univention/components/intercom-service/commit/14c4efdbb728b2e2cea1f2b063cf9ed42d117e94))
* new version for 5.0 ([6ce4a23](https://git.knut.univention.de/univention/components/intercom-service/commit/6ce4a239cc51715cc677345818b7215d75f28a83))
* pipeline for docker image build and push ([a9a8f31](https://git.knut.univention.de/univention/components/intercom-service/commit/a9a8f311a92876c54a33b6f5669bfcdaac311000))
* push develop tag ([99b1a61](https://git.knut.univention.de/univention/components/intercom-service/commit/99b1a6185941861c2914885d63509382437afdb4))
* refresh token when possible ([004c25d](https://git.knut.univention.de/univention/components/intercom-service/commit/004c25d374ad95f5b25e689501bc250918d53250))
* set prod docs for intercom-service ([c3107ed](https://git.knut.univention.de/univention/components/intercom-service/commit/c3107ed2cc6af3fa5b69bd592c16da98e76123e6))
* troubleshooting updates ([2218119](https://git.knut.univention.de/univention/components/intercom-service/commit/2218119a29c1f73b5cd11f33b41ed05c5e050b3f))
* upload script and file checking ([985a78f](https://git.knut.univention.de/univention/components/intercom-service/commit/985a78f23fe5134de902543cd23780f32154e6d9))
* variable splitted into other variables ([5adb372](https://git.knut.univention.de/univention/components/intercom-service/commit/5adb372acdc41b48a545ef5a38ad36b69789752f))
* verify and decode OIDC JWTs [upx/iam-team[#80](https://git.knut.univention.de/univention/components/intercom-service/issues/80)] ([9bd76cc](https://git.knut.univention.de/univention/components/intercom-service/commit/9bd76cc3841aec8091d8fd2342b5a71c4781e800))


### Bug Fixes

* acess forbidden on pipeline ([0a01434](https://git.knut.univention.de/univention/components/intercom-service/commit/0a014344d193621dacdbe3d82480ac939c52e668))
* add .bak from aspell to gitignore ([0a73a10](https://git.knut.univention.de/univention/components/intercom-service/commit/0a73a10309c359325f742d2827f6c36a4b50e1a4))
* add & link matrix documentation ([3ded7b5](https://git.knut.univention.de/univention/components/intercom-service/commit/3ded7b5bdea28ef82dad114061b0079ff11cf52c))
* add BCL Keycloak instructions ([6107cfd](https://git.knut.univention.de/univention/components/intercom-service/commit/6107cfd8908e8e817fa85f0e0e91649b6d4cf35c))
* add build-directories to gitignore ([182541a](https://git.knut.univention.de/univention/components/intercom-service/commit/182541a21ee3a3c1e98c9f60f8af53e9b5f8d41f))
* add figure descriptions ([c7a9a73](https://git.knut.univention.de/univention/components/intercom-service/commit/c7a9a73142cbac76aa8231bc1a37e68246174558))
* add missing comma ([c86a214](https://git.knut.univention.de/univention/components/intercom-service/commit/c86a214d09ead60adb25d172b15172a7cecc7602))
* add production stage ([e980644](https://git.knut.univention.de/univention/components/intercom-service/commit/e980644a6e8a83c59fa3cd6ae89547afc3f7f75d))
* add protocol to default portal url ([60f026c](https://git.knut.univention.de/univention/components/intercom-service/commit/60f026c34c495d40b7d77253ea81fc49b53ea3e5))
* better example for set ([45db8ff](https://git.knut.univention.de/univention/components/intercom-service/commit/45db8ff63f0dd8f3f627614ca08ac5d1c35a97d4))
* change URL schema ([854fb27](https://git.knut.univention.de/univention/components/intercom-service/commit/854fb276813831715f31dd27db4e1d2030dd7918))
* ci image tag ([e1ce876](https://git.knut.univention.de/univention/components/intercom-service/commit/e1ce8764afeac62bf40086e19b4d484565a0e9bb))
* cleanup text & add latex flush ([82fd3a7](https://git.knut.univention.de/univention/components/intercom-service/commit/82fd3a7f923678648c7332077f7fc1f707ab5c12))
* **core:** refresh nextcloud token if expired ([a3a67ec](https://git.knut.univention.de/univention/components/intercom-service/commit/a3a67ec9094e7b7c0f51303e1eb138ec5badbfb0))
* correct pdf name ci ([809f224](https://git.knut.univention.de/univention/components/intercom-service/commit/809f224cf97a8b7af02541f3642007f0902f4f10))
* **csrf:** [#57](https://git.knut.univention.de/univention/components/intercom-service/issues/57) Cookie Settings secure/same-site ([4591c05](https://git.knut.univention.de/univention/components/intercom-service/commit/4591c056951d9ee16a28a8b3780ca4dbe46fb288))
* dns to appcenter compose ([8310ad9](https://git.knut.univention.de/univention/components/intercom-service/commit/8310ad930759aa9f97ab29cdad52f5bacafece39))
* Don't restrict to domainctontroller_master ([93db1f5](https://git.knut.univention.de/univention/components/intercom-service/commit/93db1f58785655276cb4a6c64deb6b99d0178721))
* english/german typos ([77cbb8f](https://git.knut.univention.de/univention/components/intercom-service/commit/77cbb8f121e61e9d7ed425219f9ae405eede90f4))
* give redis specific name ([a459349](https://git.knut.univention.de/univention/components/intercom-service/commit/a45934921496195532e6e05ab412c38554ff2537))
* ICS may now be installed on any node ([8376edb](https://git.knut.univention.de/univention/components/intercom-service/commit/8376edb93c293f770431e8ea5e405b71bb31f313))
* intercom secret no longer needed ([41b98a6](https://git.knut.univention.de/univention/components/intercom-service/commit/41b98a656e919b815362228d9999298fe52d8cc4))
* **intercom:** wait for redis service ([cd819b6](https://git.knut.univention.de/univention/components/intercom-service/commit/cd819b6ced6433e532e74a8878943d05412c1416))
* **logging:** circular dependency ([0dc621c](https://git.knut.univention.de/univention/components/intercom-service/commit/0dc621c15d963abf3cdf755d096ade871cc938f8))
* **logging:** message formatting ([db9a0ea](https://git.knut.univention.de/univention/components/intercom-service/commit/db9a0ea5f162f98e11bde547a8f9ab20c1577c38))
* **logging:** replace console with logger ([1853ada](https://git.knut.univention.de/univention/components/intercom-service/commit/1853adaffe6b9ac68e2cb53f67079b3eecd2c318))
* **logging:** replace console with logger ([b687866](https://git.knut.univention.de/univention/components/intercom-service/commit/b687866c56d750159f47780322456986e477ae0d))
* missing quotation marks ([94a1c81](https://git.knut.univention.de/univention/components/intercom-service/commit/94a1c815211029cff064f7816def7b6c6f7b2f7d))
* move deployscripts & tests ([9b29d4d](https://git.knut.univention.de/univention/components/intercom-service/commit/9b29d4dbcf2496091321a9f2750b0c42ee6ca6d4))
* remove duplicated line ([bab4126](https://git.knut.univention.de/univention/components/intercom-service/commit/bab4126562ff530b82ad0fefa204c71bc0487188))
* remove external cache redis ([e516de9](https://git.knut.univention.de/univention/components/intercom-service/commit/e516de947a8eb8a435007b2af0b43c817167479e))
* remove obsolete readme ([7de1313](https://git.knut.univention.de/univention/components/intercom-service/commit/7de1313a0e188025cdf1d7347326fe1d968307bf))
* remove obsolete TODO & general set ([98ad1b1](https://git.knut.univention.de/univention/components/intercom-service/commit/98ad1b1b30ba61bdeaf12ac90bb1d59a7f14cbad))
* remove obsolete unused compose file ([411b466](https://git.knut.univention.de/univention/components/intercom-service/commit/411b4661b8fc47186122783034f9709fba7247b8))
* remove unused references ([f02488f](https://git.knut.univention.de/univention/components/intercom-service/commit/f02488f8ab2540adfe1e4961fcdf94c79c70f1e2))
* replace TODO with missing info ([00bc210](https://git.knut.univention.de/univention/components/intercom-service/commit/00bc2106313e609d8cca7aef8305254b183ccfad))
* set correct UCS version ([2fd6fdc](https://git.knut.univention.de/univention/components/intercom-service/commit/2fd6fdccacbc7a4a45c77fa0636b6525409fcba6))
* set correct version keycloak requirement ([bf51ec9](https://git.knut.univention.de/univention/components/intercom-service/commit/bf51ec938befb3fb2c83cc97c6b93e3f04e9ec3b))
* set doc target version to 0.9 ([0b9748e](https://git.knut.univention.de/univention/components/intercom-service/commit/0b9748ef268e666abfec3633ba066bf78043e579))
* spelling ([8c15eb1](https://git.knut.univention.de/univention/components/intercom-service/commit/8c15eb1691fa1ff0980aa1a1c1d9ab01e9ad1c14))
* spelling & formating ([16fd8d6](https://git.knut.univention.de/univention/components/intercom-service/commit/16fd8d647992af834f1fd9bb8114021f7d266d4c))
* spelling error intercom_detail ([04db25a](https://git.knut.univention.de/univention/components/intercom-service/commit/04db25a2febff222558d1c9ecfbd424b03215f22))
* typo in nordeck ([0781b8a](https://git.knut.univention.de/univention/components/intercom-service/commit/0781b8a25d871d0a045aa82e1b576ed063c375d9))
* typos & grammer ([82b7985](https://git.knut.univention.de/univention/components/intercom-service/commit/82b79855223c8be89c7eeaed2070fa76060686e2))
* typos & grammer ([07ff385](https://git.knut.univention.de/univention/components/intercom-service/commit/07ff385ea9a08b91052cc9f87462b96b73f8045a))
* uncomment docs prod ([0e4e2ae](https://git.knut.univention.de/univention/components/intercom-service/commit/0e4e2aec390f255cdd77203d3e4b631a4e3b935c))
* use correct docker networking url ([b657850](https://git.knut.univention.de/univention/components/intercom-service/commit/b657850d460453f1813aeed8e7171ff8d4e431cd))
* whitespace ([c91e743](https://git.knut.univention.de/univention/components/intercom-service/commit/c91e743bde6df453a46c3a365a26d7ecb8b5c6d5))

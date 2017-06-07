/**
 * @license
 * Copyright 2017 Red Hat
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {IOas20NodeVisitor, IOas30NodeVisitor, IOasNodeVisitor} from "./visitor.iface";
import {Oas20Document} from "../models/2.0/document.model";
import {OasExtension} from "../models/extension.model";
import {Oas20Parameter, Oas20ParameterDefinition} from "../models/2.0/parameter.model";
import {Oas20Response, Oas20ResponseDefinition} from "../models/2.0/response.model";
import {
    Oas20AdditionalPropertiesSchema,
    Oas20AllOfSchema,
    Oas20ItemsSchema,
    Oas20PropertySchema,
    Oas20SchemaDefinition
} from "../models/2.0/schema.model";
import {Oas20Example} from "../models/2.0/example.model";
import {Oas20Items} from "../models/2.0/items.model";
import {Oas20SecurityDefinitions} from "../models/2.0/security-definitions.model";
import {Oas20Scopes} from "../models/2.0/scopes.model";
import {Oas20Definitions} from "../models/2.0/definitions.model";
import {Oas20ParametersDefinitions} from "../models/2.0/parameters-definitions.model";
import {Oas20ResponsesDefinitions} from "../models/2.0/responses-definitions.model";
import {OasNodePath} from "../models/node-path";
import {OasDocument} from "../models/document.model";
import {OasInfo} from "../models/common/info.model";
import {OasContact} from "../models/common/contact.model";
import {OasLicense} from "../models/common/license.model";
import {OasPaths} from "../models/common/paths.model";
import {OasPathItem} from "../models/common/path-item.model";
import {OasOperation} from "../models/common/operation.model";
import {OasExternalDocumentation} from "../models/common/external-documentation.model";
import {OasSecurityRequirement} from "../models/common/security-requirement.model";
import {OasResponses} from "../models/common/responses.model";
import {OasSchema} from "../models/common/schema.model";
import {OasHeaders} from "../models/common/headers.model";
import {OasHeader} from "../models/common/header.model";
import {OasTag} from "../models/common/tag.model";
import {OasSecurityScheme} from "../models/common/security-scheme.model";
import {OasXML} from "../models/common/xml.model";
import {
    Oas30AdditionalPropertiesSchema,
    Oas30AllOfSchema,
    Oas30AnyOfSchema,
    Oas30ItemsSchema,
    Oas30NotSchema,
    Oas30OneOfSchema,
    Oas30PropertySchema,
    Oas30SchemaDefinition
} from "../models/3.0/schema.model";
import {Oas30Parameter, Oas30ParameterDefinition} from "../models/3.0/parameter.model";
import {Oas30Content} from "../models/3.0/content.model";
import {Oas30Link, Oas30LinkDefinition} from "../models/3.0/link.model";
import {Oas30Callback, Oas30CallbackDefinition} from "../models/3.0/callback.model";
import {Oas30Example, Oas30ExampleDefinition} from "../models/3.0/example.model";
import {Oas30RequestBody, Oas30RequestBodyDefinition} from "../models/3.0/request-body.model";
import {Oas30HeaderDefinition} from "../models/3.0/header.model";
import {Oas30Scopes} from "../models/3.0/scopes.model";
import {
    Oas30AuthorizationCodeOAuthFlow,
    Oas30ClientCredentialsOAuthFlow,
    Oas30ImplicitOAuthFlow,
    Oas30PasswordOAuthFlow
} from "../models/3.0/oauth-flow.model";
import {Oas30OAuthFlows} from "../models/3.0/oauth-flows.model";
import {Oas30Components} from "../models/3.0/components.model";
import {Oas30Callbacks} from "../models/3.0/callbacks.model";
import {Oas30Links} from "../models/3.0/links.model";
import {Oas30CallbackPathItem} from "../models/3.0/path-item.model";
import {Oas30Response, Oas30ResponseDefinition} from "../models/3.0/response.model";
import {Oas30MediaType} from "../models/3.0/media-type.model";
import {Oas30Encoding} from "../models/3.0/encoding.model";
import {Oas30EncodingProperty} from "../models/3.0/encoding-property.model";
import {Oas30LinkParameters} from "../models/3.0/link-parameters.model";
import {Oas30LinkParameterExpression} from "../models/3.0/link-parameter-expression.model";
import {Oas30LinkServer, Oas30Server} from "../models/3.0/server.model";
import {Oas30ServerVariables} from "../models/3.0/server-variables.model";
import {Oas30ServerVariable} from "../models/3.0/server-variable.model";


/**
 * Base class for Node Path visitors for all versions of OpenAPI.
 */
export abstract class OasNodePathVisitor implements IOasNodeVisitor {

    protected _path: OasNodePath = new OasNodePath();
    protected _index: string | number;

    public path(): OasNodePath {
        return this._path;
    }

    visitDocument(node: OasDocument): void {
        // Nothing to do for the root
    }

    visitInfo(node: OasInfo): void {
        this._path.prependSegment("info");
    }

    visitContact(node: OasContact): void {
        this._path.prependSegment("contact");
    }

    visitLicense(node: OasLicense): void {
        this._path.prependSegment("license");
    }

    visitPaths(node: OasPaths): void {
        this._path.prependSegment("paths", this._index);
        this._index = undefined;
    }

    visitPathItem(node: OasPathItem): void {
        this._index = node.path();
    }

    visitOperation(node: OasOperation): void {
        this._path.prependSegment(node.method());
    }

    visitExternalDocumentation(node: OasExternalDocumentation): void {
        this._path.prependSegment("externalDocs");
    }

    visitSecurityRequirement(node: OasSecurityRequirement): void {
        let securityRequirements: OasSecurityRequirement[] = (<any>node.parent()).security;
        let idx: number = 0;
        for (let securityRequirement of securityRequirements) {
            if (securityRequirement === node) {
                this._path.prependSegment("security", idx);
                break;
            } else {
                idx++;
            }
        }
    }

    visitResponses(node: OasResponses): void {
        this._path.prependSegment("responses", this._index);
        this._index = undefined;
    }

    visitSchema(node: OasSchema): void {
        this._path.prependSegment("schema");
    }

    visitHeaders(node: OasHeaders): void {
        this._path.prependSegment("headers", this._index);
        this._index = undefined;
    }

    visitHeader(node: OasHeader): void {
        this._index = node.headerName();
    }

    visitTag(node: OasTag): void {
        let tags: OasTag[] = (<any>node.parent()).tags;
        let idx: number = 0;
        for (let tag of tags) {
            if (tag === node) {
                this._path.prependSegment("tags", idx);
                break;
            } else {
                idx++;
            }
        }
    }

    visitSecurityScheme(node: OasSecurityScheme): void {
        this._index = node.schemeName();
    }

    visitXML(node: OasXML): void {
        this._path.prependSegment("xml");
    }

    visitExtension(node: OasExtension): void {
        this._path.prependSegment(node.name);
    }

}


/**
 * A visitor used to create a node path for any given node.  Here are some examples
 * of node paths:
 *
 * - The root document:
 *   /
 *
 * - An 'Info' object
 *   /info
 *
 * - A GET operation from pet-store:
 *   /paths[/pet/findByStatus]/get
 *
 * - External Documentation for a tag:
 *   /tags[2]/externalDocs
 *
 */
export class Oas20NodePathVisitor extends OasNodePathVisitor implements IOas20NodeVisitor {

    visitDocument(node: Oas20Document): void {
        // Nothing to do for the root
    }

    visitParameter(node: Oas20Parameter): void {
        let params: Oas20Parameter[] = (<any>node.parent()).parameters;
        let idx: number = 0;
        for (let param of params) {
            if (param === node) {
                this._path.prependSegment("parameters", idx);
                break;
            } else {
                idx++;
            }
        }
    }

    visitParameterDefinition(node: Oas20ParameterDefinition): void {
        this._index = node.parameterName();
    }

    visitResponseDefinition(node: Oas20ResponseDefinition): void {
        this._index = node.name();
    }

    visitExample(node: Oas20Example): void {
        this._path.prependSegment("examples");
    }

    visitItems(node: Oas20Items): void {
        this._path.prependSegment("items");
    }

    visitSecurityDefinitions(node: Oas20SecurityDefinitions): void {
        this._path.prependSegment("securityDefinitions", this._index);
        this._index = undefined;
    }

    visitScopes(node: Oas20Scopes): void {
        this._path.prependSegment("scopes");
    }

    visitSchemaDefinition(node: Oas20SchemaDefinition): void {
        this._index = node.definitionName();
    }

    visitPropertySchema(node: Oas20PropertySchema): void {
        this._path.prependSegment("properties", node.propertyName());
    }

    visitAdditionalPropertiesSchema(node: Oas20AdditionalPropertiesSchema): void {
        this._path.prependSegment("additionalProperties");
    }

    visitAllOfSchema(node: Oas20AllOfSchema): void {
        let schemas: Oas20AllOfSchema[] = (<any>node.parent()).allOf;
        let idx: number = 0;
        for (let schema of schemas) {
            if (schema === node) {
                this._path.prependSegment("allOf", idx);
                break;
            } else {
                idx++;
            }
        }
    }

    visitItemsSchema(node: Oas20ItemsSchema): void {
        let schemas: Oas20ItemsSchema[] = (<any>node.parent()).items;
        if (Array.isArray(schemas)) {
            let idx: number = 0;
            for (let schema of schemas) {
                if (schema === node) {
                    this._path.prependSegment("items", idx);
                    break;
                } else {
                    idx++;
                }
            }
        } else {
            this._path.prependSegment("items");
        }
    }

    visitDefinitions(node: Oas20Definitions): void {
        this._path.prependSegment("definitions", this._index);
        this._index = undefined;
    }

    visitParametersDefinitions(node: Oas20ParametersDefinitions): void {
        this._path.prependSegment("parameters", this._index);
        this._index = undefined;
    }

    visitResponsesDefinitions(node: Oas20ResponsesDefinitions): void {
        this._path.prependSegment("responses", this._index);
        this._index = undefined;
    }

    visitResponse(node: Oas20Response): void {
        this._index = node.statusCode();
    }

}


/**
 * The 3.0 version of a node path visitor (creates a node path from a node).
 */
export class Oas30NodePathVisitor extends OasNodePathVisitor implements IOas30NodeVisitor {

    visitParameter(node: Oas30Parameter): void {
        let params: Oas30Parameter[] = (<any>node.parent()).parameters;
        let idx: number = 0;
        for (let param of params) {
            if (param === node) {
                this._path.prependSegment("parameters", idx);
                break;
            } else {
                idx++;
            }
        }
    }

    visitParameterDefinition(node: Oas30ParameterDefinition): void {
        this._path.prependSegment("parameters", node.parameterName());
    }

    visitResponse(node: Oas30Response): void {
        this._index = node.statusCode();
    }

    visitContent(node: Oas30Content): void {
        this._path.prependSegment("content", this._index);
        this._index = null;
    }

    visitMediaType(node: Oas30MediaType): void {
        this._index = node.name();
    }

    visitEncoding(node: Oas30Encoding): void {
        this._path.prependSegment("encoding", this._index);
        this._index = null;
    }

    visitEncodingProperty(node: Oas30EncodingProperty): void {
        this._index = node.name();
    }

    visitExample(node: Oas30Example): void {
        this._index = node.name();
    }

    visitLinks(node: Oas30Links): void {
        this._path.prependSegment("links");
    }

    visitLink(node: Oas30Link): void {
        this._index = node.name();
    }

    visitLinkParameters(node: Oas30LinkParameters): void {
        this._path.prependSegment("parameters", this._index);
        this._index = null;
    }

    visitLinkParameterExpression(node: Oas30LinkParameterExpression): void {
        this._index = node.name();
    }

    visitLinkServer(node: Oas30LinkServer): void {
        this._path.prependSegment("server");
    }

    visitResponseDefinition(node: Oas30ResponseDefinition): void {
        this._path.prependSegment("responses", node.name());
    }

    visitRequestBody(node: Oas30RequestBody): void {
        this._path.prependSegment("requestBody");
    }

    visitCallbacks(node: Oas30Callbacks): void {
        // TODO callbacks is problematic because it is indexed two layers deep :(
        this._path.prependSegment("callbacks", this._index);
        this._index = undefined;
    }

    visitCallback(node: Oas30Callback): void {
        // TODO callbacks is problematic because it is indexed two layers deep :(
        this._path.prependSegment("callback", this._index);
        this._index = undefined;
    }

    visitCallbackPathItem(node: Oas30CallbackPathItem): void {
        // TODO callbacks is problematic because it is indexed two layers deep :(
        super.visitPathItem(node);
    }

    visitServer(node: Oas30Server): void {
        let servers: any[] = (<any>node.parent()).servers;
        let idx: number = 0;
        for (let server of servers) {
            if (server === node) {
                this._path.prependSegment("servers", idx);
                break;
            } else {
                idx++;
            }
        }
    }

    visitServerVariables(node: Oas30ServerVariables): void {
        this._path.prependSegment("variables", this._index);
        this._index = null;
    }

    visitServerVariable(node: Oas30ServerVariable): void {
        this._index = node.name();
    }

    visitAllOfSchema(node: Oas30AllOfSchema): void {
        let schemas: Oas30AllOfSchema[] = (<any>node.parent()).allOf;
        let idx: number = 0;
        for (let schema of schemas) {
            if (schema === node) {
                this._path.prependSegment("allOf", idx);
                break;
            } else {
                idx++;
            }
        }
    }

    visitAnyOfSchema(node: Oas30AnyOfSchema): void {
        let schemas: Oas30AnyOfSchema[] = (<any>node.parent()).anyOf;
        let idx: number = 0;
        for (let schema of schemas) {
            if (schema === node) {
                this._path.prependSegment("anyOf", idx);
                break;
            } else {
                idx++;
            }
        }
    }

    visitOneOfSchema(node: Oas30OneOfSchema): void {
        let schemas: Oas30OneOfSchema[] = (<any>node.parent()).oneOf;
        let idx: number = 0;
        for (let schema of schemas) {
            if (schema === node) {
                this._path.prependSegment("oneOf", idx);
                break;
            } else {
                idx++;
            }
        }
    }

    visitNotSchema(node: Oas30NotSchema): void {
        this._path.prependSegment("not");
    }

    visitPropertySchema(node: Oas30PropertySchema): void {
        this._path.prependSegment("properties", node.propertyName());
    }

    visitItemsSchema(node: Oas30ItemsSchema): void {
        let schemas: Oas30ItemsSchema[] = (<any>node.parent()).items;
        if (Array.isArray(schemas)) {
            let idx: number = 0;
            for (let schema of schemas) {
                if (schema === node) {
                    this._path.prependSegment("items", idx);
                    break;
                } else {
                    idx++;
                }
            }
        } else {
            this._path.prependSegment("items");
        }
    }

    visitAdditionalPropertiesSchema(node: Oas30AdditionalPropertiesSchema): void {
        this._path.prependSegment("additionalProperties");
    }

    visitComponents(node: Oas30Components): void {
        this._path.prependSegment("components");
    }

    visitSchemaDefinition(node: Oas30SchemaDefinition): void {
        this._path.prependSegment("schemas", node.name());
    }

    visitExampleDefinition(node: Oas30ExampleDefinition): void {
        this._path.prependSegment("examples", node.name());
    }

    visitRequestBodyDefinition(node: Oas30RequestBodyDefinition): void {
        this._path.prependSegment("requestBodies", node.name());
    }

    visitHeaderDefinition(node: Oas30HeaderDefinition): void {
        this._path.prependSegment("headers", node.name());
    }

    visitOAuthFlows(node: Oas30OAuthFlows): void {
        this._path.prependSegment("flows");
    }

    visitImplicitOAuthFlow(node: Oas30ImplicitOAuthFlow): void {
        this._path.prependSegment("implicit");
    }

    visitPasswordOAuthFlow(node: Oas30PasswordOAuthFlow): void {
        this._path.prependSegment("password");
    }

    visitClientCredentialsOAuthFlow(node: Oas30ClientCredentialsOAuthFlow): void {
        this._path.prependSegment("clientCredentials");
    }

    visitAuthorizationCodeOAuthFlow(node: Oas30AuthorizationCodeOAuthFlow): void {
        this._path.prependSegment("authorizationCode");
    }

    visitScopes(node: Oas30Scopes): void {
        this._path.prependSegment("scopes");
    }

    visitLinkDefinition(node: Oas30LinkDefinition): void {
        this._path.prependSegment("links", node.name());
    }

    visitCallbackDefinition(node: Oas30CallbackDefinition): void {
        this._path.prependSegment("callbacks", node.name());
    }

    visitSecurityScheme(node: OasSecurityScheme): void {
        this._path.prependSegment("securitySchemes", node.schemeName());
    }

}

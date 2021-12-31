import type {
    RESTDeleteAPIGuildTemplateResult, RESTGetAPIGuildTemplatesResult, RESTGetAPITemplateResult,
    RESTPatchAPIGuildTemplateJSONBody, RESTPatchAPIGuildTemplateResult, RESTPostAPIGuildTemplatesJSONBody,
    RESTPostAPIGuildTemplatesResult, RESTPostAPITemplateCreateGuildJSONBody, RESTPostAPITemplateCreateGuildResult,
    RESTPutAPIGuildTemplateSyncResult
} from "discord-api-types";
import { Routes } from "../Endpoints";

/**
 * Methods for interacting with Guild Templates
 */
class GuildTemplateMethods {
    public requestHandler: import("../RequestHandler");

    /**
     * Create a new Guild Template Method Handler
     *
     * Usually SnowTransfer creates a method handler for you, this is here for completion
     *
     * You can access the methods listed via `client.guildTemplate.method`, where `client` is an initialized SnowTransfer instance
     * @param requestHandler request handler that calls the rest api
     */
    public constructor(requestHandler: import("../RequestHandler")) {
        this.requestHandler = requestHandler;
    }

    public getGuildTemplate(code: string): Promise<RESTGetAPITemplateResult> {
        return this.requestHandler.request(Routes.template(code), "get", "json");
    }

    public createGuildFromGuildTemplate(code: string, options: RESTPostAPIGuildTemplatesJSONBody): Promise<RESTPostAPIGuildTemplatesResult> {
        return this.requestHandler.request(Routes.template(code), "post", "json", options);
    }

    /**
     * | Permissions needed | Condition |
     * |--------------------|-----------|
     * | MANAGE_GUILD       | always    |
     */
    public getGuildTemplates(guildId: string): Promise<RESTGetAPIGuildTemplatesResult> {
        return this.requestHandler.request(Routes.guildTemplates(guildId), "get", "json");
    }

    /**
     * | Permissions needed | Condition |
     * |--------------------|-----------|
     * | MANAGE_GUILD       | always    |
     */
    public createGuildTemplate(guildId: string, data: RESTPostAPITemplateCreateGuildJSONBody): Promise<RESTPostAPITemplateCreateGuildResult> {
        return this.requestHandler.request(Routes.guildTemplates(guildId), "post", "json", data);
    }

    /**
     * | Permissions needed | Condition |
     * |--------------------|-----------|
     * | MANAGE_GUILD       | always    |
     */
    public syncGuildTemplate(guildId: string, code: string): Promise<RESTPutAPIGuildTemplateSyncResult> {
        return this.requestHandler.request(Routes.guildTemplate(guildId, code), "put", "json");
    }

    /**
     * | Permissions needed | Condition |
     * |--------------------|-----------|
     * | MANAGE_GUILD       | always    |
     */
    public modifyGuildTemplate(guildId: string, code: string, data: RESTPatchAPIGuildTemplateJSONBody): Promise<RESTPatchAPIGuildTemplateResult> {
        return this.requestHandler.request(Routes.guildTemplate(guildId, code), "patch", "json", data);
    }

    /**
     * | Permissions needed | Condition |
     * |--------------------|-----------|
     * | MANAGE_GUILD       | always    |
     */
    public deleteGuildTemplate(guildId: string, code: string): Promise<RESTDeleteAPIGuildTemplateResult> {
        return this.requestHandler.request(Routes.guildTemplate(guildId, code), "delete", "json");
    }
}

export = GuildTemplateMethods;

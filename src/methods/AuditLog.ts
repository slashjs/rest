import type { RESTGetAPIAuditLogQuery, RESTGetAPIAuditLogResult } from "discord-api-types";
import { Routes } from "../Endpoints";

/**
 * Methods for interacting with Guild Audit Logs
 */
class AuditLogMethods {
    public requestHandler: import("../RequestHandler");

    /**
     * Create a new Audit Log Method Handler
     *
     * Usually SnowTransfer creates a method handler for you, this is here for completion
     *
     * You can access the methods listed via `client.auditLog.method`, where `client` is an initialized SnowTransfer instance
     * @param requestHandler request handler that calls the rest api
     */
    public constructor(requestHandler: import("../RequestHandler")) {
        this.requestHandler = requestHandler;
    }

    /**
     * Get the audit logs of the specified guild id
     * @param guildId id of a guild
     * @param data optional audit log filter values
     * @returns An object with [audit log data](https://discord.com/developers/docs/resources/audit-log#audit-log-object)
     *
     * | Permissions needed | Condition |
     * |--------------------|-----------|
     * | VIEW_AUDIT_LOG     | always    |
     */
    public async getAuditLog(guildId: string, data?: RESTGetAPIAuditLogQuery): Promise<RESTGetAPIAuditLogResult> {
        return this.requestHandler.request(Routes.guildAuditLog(guildId), "get", "json", data);
    }
}

export = AuditLogMethods;
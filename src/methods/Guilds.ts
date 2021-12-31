import type {
    APIGuild, APIGuildMember, APIGuildPreview, APIGuildWelcomeScreen,
    RESTGetAPIGuildBansResult, RESTGetAPIGuildChannelsResult, RESTGetAPIGuildIntegrationsResult,
    RESTGetAPIGuildInvitesResult, RESTGetAPIGuildMemberResult, RESTGetAPIGuildMembersQuery,
    RESTGetAPIGuildMembersSearchResult, RESTGetAPIGuildMembersResult, RESTGetAPIGuildMembersSearchQuery,
    RESTGetAPIGuildPruneCountQuery, RESTGetAPIGuildPruneCountResult, RESTGetAPIGuildRolesResult,
    RESTGetAPIGuildThreadsResult, RESTGetAPIGuildVanityUrlResult, RESTGetAPIGuildVoiceRegionsResult,
    RESTGetAPIGuildWelcomeScreenResult, RESTGetAPIGuildWidgetJSONResult, RESTGetAPIGuildWidgetSettingsResult,
    RESTPatchAPIGuildChannelPositionsJSONBody, RESTPatchAPIGuildJSONBody, RESTPatchAPIGuildMemberJSONBody,
    RESTPatchAPIGuildResult, RESTPatchAPIGuildRoleJSONBody, RESTPatchAPIGuildRolePositionsResult,
    RESTPatchAPIGuildRoleResult, RESTPatchAPIGuildVoiceStateCurrentMemberJSONBody,
    RESTPatchAPIGuildVoiceStateUserJSONBody, RESTPatchAPIGuildWelcomeScreenJSONBody,
    RESTPatchAPIGuildWidgetSettingsJSONBody, RESTPatchAPIGuildWidgetSettingsResult, RESTPostAPIGuildChannelJSONBody,
    RESTPostAPIGuildChannelResult, RESTPostAPIGuildPruneJSONBody, RESTPostAPIGuildPruneResult,
    RESTPostAPIGuildRoleJSONBody, RESTPostAPIGuildRoleResult, RESTPostAPIGuildsJSONBody, RESTPostAPIGuildsResult,
    RESTPutAPIGuildMemberJSONBody
} from "discord-api-types";
import { Routes } from "../Endpoints";

/**
 * Methods for interacting with Guilds
 */
class GuildMethods {
    public requestHandler: import("../RequestHandler");

    /**
     * Create a new Guild Method Handler
     *
     * Usually SnowTransfer creates a method handler for you, this is here for completion
     *
     * You can access the methods listed via `client.guild.method`, where `client` is an initialized SnowTransfer instance
     * @param requestHandler request handler that calls the rest api
     */
    public constructor(requestHandler: import("../RequestHandler")) {
        this.requestHandler = requestHandler;
    }

    /**
     * Create a new Guild, **limited to 10 guilds (you may create more if you are whitelisted)**
     * Check the [discord docs](https://discord.com/developers/docs/resources/guild#create-guild) for more infos
     * @param {object} data data
     * @returns [Guild](https://discord.com/developers/docs/resources/guild#guild-object)
     *
     * @example
     * // Creates a simple guild with the name "Demo Guild"
     * let client = new SnowTransfer('TOKEN')
     * let guildData = {
     *   name: 'Demo Guild'
     * }
     * client.guild.createGuild(guildData)
     */
    public async createGuild(data: RESTPostAPIGuildsJSONBody): Promise<RESTPostAPIGuildsResult> {
        return this.requestHandler.request(Routes.guilds(), "post", "json", data);
    }

    /**
     * Get a guild via Id
     *
     * **Your bot has to be a member of the guild for this function to work**
     * @param guildId Id of the guild
     * @returns [Guild object](https://discord.com/developers/docs/resources/guild#guild-object)
     */
    public async getGuild(guildId: string, options?: { with_counts?: boolean; }): Promise<APIGuild> {
        return this.requestHandler.request(Routes.guild(guildId), "get", "json", options);
    }

    public async getGuildPreview(guildId: string): Promise<APIGuildPreview> {
        return this.requestHandler.request(Routes.guildPreview(guildId), "get", "json");
    }

    /**
     * Update a guild
     * @param guildId Id of the guild
     * @param data data
     * @returns [Guild object](https://discord.com/developers/docs/resources/guild#guild-object)
     *
     * | Permissions needed | Condition |
     * |--------------------|-----------|
     * | MANAGE_GUILD       | always    |
     *
     * @example
     * // Update the name of a guild to "Nice Guild"
     * let client = new SnowTransfer('TOKEN')
     * let guildData = {
     *   name: 'Nice Guild'
     * }
     * client.guild.updateGuild('guild Id', guildData)
     */
    public async updateGuild(guildId: string, data: RESTPatchAPIGuildJSONBody): Promise<RESTPatchAPIGuildResult> {
        return this.requestHandler.request(Routes.guild(guildId), "patch", "json", data);
    }

    /**
     * Delete a guild
     *
     * **Your bot has to be the owner of the guild to do this**
     *
     * **This action is irreversible, so use it with caution!**
     * @param guildId Id of the guild
     * @returns Resolves the Promise on successful execution
     */
    public async deleteGuild(guildId: string): Promise<void> {
        return this.requestHandler.request(Routes.guild(guildId), "delete", "json");
    }

    /**
     * Get a list of channels for a guild
     * @param guildId Id of the guild
     * @returns list of [channels](https://discord.com/developers/docs/resources/channel#channel-object-channel-structure)
     */
    public async getGuildChannels(guildId: string): Promise<RESTGetAPIGuildChannelsResult> {
        return this.requestHandler.request(Routes.guildChannels(guildId), "get", "json");
    }

    /**
     * Create a channel within a guild
     * @param guildId Id of the guild
     * @param data channel properties
     * @returns [channel object](https://discord.com/developers/docs/resources/channel#channel-object-channel-structure)
     *
     * | Permissions needed | Condition                                     |
     * |--------------------|-----------------------------------------------|
     * | MANAGE_CHANNELS    | always                                        |
     * | ADMINISTRATOR      | setting MANAGE_ROLES in permission_overwrites |
     */
    public async createGuildChannel(guildId: string, data: RESTPostAPIGuildChannelJSONBody): Promise<RESTPostAPIGuildChannelResult> {
        return this.requestHandler.request(Routes.guildChannels(guildId), "post", "json", data);
    }

    /**
     * Batch update the positions of channels
     * @param guildId Id of the guild
     * @returns Resolves the Promise on successful execution
     */
    public async updateChannelPositions(guildId: string, data: RESTPatchAPIGuildChannelPositionsJSONBody): Promise<void> {
        return this.requestHandler.request(Routes.guildChannels(guildId), "patch", "json", data);
    }

    /**
     * Returns all active threads in the guild, including public and private threads. Threads are ordered by their `id`, in descending order
     * @param guildId Id of the guild
     * @returns All active threads and members the current user has access to.
     */
    public async listActiveThreads(guildId: string): Promise<RESTGetAPIGuildThreadsResult> {
        return this.requestHandler.request(Routes.guildActiveThreads(guildId), "get", "json");
    }

    /**
     * Get a guild member via Id
     * @param guildId Id of the guild
     * @param memberId Id of the guild member
     * @returns [guild member](https://discord.com/developers/docs/resources/guild#guild-member-object-guild-member-structure)
     */
    public async getGuildMember(guildId: string, memberId: string): Promise<RESTGetAPIGuildMemberResult> {
        return this.requestHandler.request(Routes.guildMember(guildId, memberId), "get", "json");
    }

    /**
     * Get a list of guild members
     * @param guildId Id of the guild
     * @param data query data
     * @returns list of [guild members](https://discord.com/developers/docs/resources/guild#guild-member-object-guild-member-structure)
     */
    public async getGuildMembers(guildId: string, data: RESTGetAPIGuildMembersQuery = {}): Promise<RESTGetAPIGuildMembersResult> {
        return this.requestHandler.request(Routes.guildMembers(guildId), "get", "json", data);
    }

    /**
     * Get a list of guild members that match a query
     * @param guildId Id of the guild
     * @param options query data
     * @returns list of [guild members](https://discord.com/developers/docs/resources/guild#guild-member-object-guild-member-structure)
     */
    public async searchGuildMembers(guildId: string, options: RESTGetAPIGuildMembersSearchQuery): Promise<RESTGetAPIGuildMembersSearchResult> {
        return this.requestHandler.request(Routes.guildMembersSearch(guildId), "get", "json", options);
    }

    /**
     * Add a guild member to a guild via oauth2 access token
     *
     * **You need the oauth2 `guilds.join` scope granted to the access_token**
     *
     *
     * **Your bot has to be a member of the guild you want to add the user to**
     *
     * @param guildId Id of the guild
     * @param memberId Id of the guild member
     * @param data object containing the needed request data
     * @returns [guild member](https://discord.com/developers/docs/resources/guild#guild-member-object-guild-member-structure)
     *
     * | Permissions needed    | Condition |
     * |-----------------------|-----------|
     * | CREATE_INSTANT_INVITE | always    |
     *
     * | OAUTH2 Scopes |
     * |---------------|
     * | guilds.join   |
     *
     * @example
     * // add a user to a server
     * let client = new SnowTransfer('TOKEN')
     * let memberData = {
     *   access_token: 'access token of a user with the guilds.join scope'
     * }
     * client.guild.addGuildMember('guildId', 'memberId', memberData)
     */
    public async addGuildMember(guildId: string, memberId: string, data: RESTPutAPIGuildMemberJSONBody): Promise<APIGuildMember> {
        return this.requestHandler.request(Routes.guildMember(guildId, memberId), "put", "json", data);
    }

    /**
     * Update properties of a guild member
     *
     * **Check the table below to make sure you have the right permissions for the types of updates**
     *
     * **Make sure that your bot has `CONNECT` and `MOVE_MEMBERS` on the channel you want to move the member to**
     * @param guildId Id of the guild
     * @param memberId Id of the guild member
     * @param data Updated properties
     * @returns Resolves the Promise on successful execution
     *
     * | Permissions needed | Condition    |
     * |--------------------|--------------|
     * | MANAGE_NICKNAMES   | Nick Updates |
     * | MANAGE_ROLES       | Role Updates |
     * | MUTE_MEMBERS       | Mute Updates |
     * | DEAFEN_MEMBERS     | Deaf Updates |
     * | MOVE_MEMBERS       | Voice Move   |
     *
     * @example
     * // Reset the nickname of a guild member
     * let client = new SnowTransfer('TOKEN')
     * let memberData = {
     *   nick: "" // You can reset nicknames by providing an empty string as the value of data.nick
     * }
     * client.guild.updateGuildMember('guild Id', 'memberId', memberData)
     */
    public async updateGuildMember(guildId: string, memberId: string, data: RESTPatchAPIGuildMemberJSONBody): Promise<void> {
        return this.requestHandler.request(Routes.guildMember(guildId, memberId), "patch", "json", data);
    }

    /**
     * Update the nick of the current user
     * @param guildId Id of the guild
     * @param data object with a nick property
     * @returns Resolves the Promise on successful execution
     *
     * | Permissions needed | Condition |
     * |--------------------|-----------|
     * | CHANGE_NICKNAME    | always    |
     *
     * @example
     * // change nick of bot to "Nice Nick"
     * let client = new SnowTransfer('TOKEN')
     * let nickData = {
     *   nick: 'Nice Nick'
     * }
     * client.guild.updateSelf('guildId', nickData)
     */
    public async updateSelf(guildId: string, data: { nick: string; }): Promise<void> {
        return this.requestHandler.request(Routes.guildCurrentMemberNickname(guildId), "patch", "json", data);
    }

    /**
     * Add a role to a guild member
     * @param guildId Id of the guild
     * @param memberId Id of the guild member
     * @param roleId Id of the role
     * @param data object with reason property
     * @returns Resolves the Promise on successful execution
     *
     * | Permissions needed | Condition |
     * |--------------------|-----------|
     * | MANAGE_ROLES       | always    |
     */
    public async addGuildMemberRole(guildId: string, memberId: string, roleId: string, data?: { reason?: string; }): Promise<void> {
        return this.requestHandler.request(Routes.guildMemberRole(guildId, memberId, roleId), "put", "json", data);
    }

    /**
     * Remove a role from a guild member
     * @param guildId Id of the guild
     * @param memberId Id of the guild member
     * @param roleId Id of the role
     * @param data object with reason property
     * @returns Resolves the Promise on successful execution
     *
     * | Permissions needed | Condition |
     * |--------------------|-----------|
     * | MANAGE_ROLES       | always    |
     */
    public async removeGuildMemberRole(guildId: string, memberId: string, roleId: string, data?: { reason?: string; }): Promise<void> {
        return this.requestHandler.request(Routes.guildMemberRole(guildId, memberId, roleId), "delete", "json", data);
    }

    /**
     * Remove a guild member (aka kick them)
     * @param guildId Id of the guild
     * @param memberId Id of the guild member
     * @param data object with reason property
     * @returns Resolves the Promise on successful execution
     *
     * | Permissions needed | Condition |
     * |--------------------|-----------|
     * | KICK_MEMBERS       | always    |
     *
     * @example
     * // Kick a member with a reason of "spam"
     * let client = new SnowTransfer('TOKEN')
     * let kickData = {
     *   reason: 'spam'
     * }
     * client.guild.removeGuildMember('guild Id', 'memberId', kickData)
     */
    public async removeGuildMember(guildId: string, memberId: string, data?: { reason?: string; }): Promise<void> {
        return this.requestHandler.request(Routes.guildMember(guildId, memberId), "delete", "json", data);
    }

    /**
     * Get bans of a guild
     * @param guildId Id of the guild
     * @returns List of [bans](https://discord.com/developers/docs/resources/guild#ban-object-ban-structure)
     *
     * | Permissions needed | Condition |
     * |--------------------|-----------|
     * | BAN_MEMBERS        | always    |
     */
    public async getGuildBans(guildId: string): Promise<RESTGetAPIGuildBansResult> {
        return this.requestHandler.request(Routes.guildBans(guildId), "get", "json");
    }

    /**
     * Ban a guild member
     * @param guildId Id of the guild
     * @param memberId Id of the guild member
     * @param data object with a reason and a delete-message-days property
     * @returns Resolves the Promise on successful execution
     *
     * | Permissions needed | Condition |
     * |--------------------|-----------|
     * | BAN_MEMBERS        | always    |
     *
     * @example
     * // Ban a user with a reason and delete the last 2 days of their messages
     * let client = new SnowTransfer('TOKEN')
     * let banData = {
     *   reason: 'Memes were not good enough',
     *   "delete_message_days":2
     * }
     * client.guild.createGuildBan('guild Id', 'memberId', banData)
     */
    public async createGuildBan(guildId: string, memberId: string, data?: { reason?: string; delete_message_days?: number; }): Promise<void> {
        return this.requestHandler.request(Routes.guildBan(guildId, memberId), "put", "json", data);
    }


    /**
     * 
     * @param guildId Id of the guild
     * @param memberId Id of the guild member
     * @param data object with a reason and a communication_disabled_until property
     * @returns Resolves the Promise on successful execution
     * | Permissions deeded | Condition |
     * |--------------------|-----------|
     * | MODERATE_MEMBERS   | always    |
     * 
     * @example
     * // Timeout a user with a reason and disable their communication for 1 week
     * let client = new SnowTransfer('TOKEN')
     * let timeoutData = {
     *  reason: 'Bad words',
     * 	"communication_disabled_until": new Date(Date.now() + 604800000).toISOString() 
     * }
     * client.guild.createGuildTimeout('guild Id', 'memberId', timeoutData)
     */
    public async createGuildTimeout(guildId: string, memberId: string, data: { reason?: string, communication_disabled_until?: string; }): Promise<void> {
        return this.requestHandler.request(Routes.guildMember(guildId, memberId), "patch", "json", data);
    }

    /**
     * Remove a ban of a user
     * @param guildId Id of the guild
     * @param memberId Id of the guild member
     * @param data object with a reason property
     * @returns Resolves the Promise on successful execution
     *
     * | Permissions needed | Condition |
     * |--------------------|-----------|
     * | BAN_MEMBERS        | always    |
     */
    public async removeGuildBan(guildId: string, memberId: string, data?: { reason?: string; }): Promise<void> {
        return this.requestHandler.request(Routes.guildBan(guildId, memberId), "delete", "json", data);
    }

    /**
     * Get a list of roles for a guild
     * @param guildId Id of the guild
     * @returns array of [roles](https://discord.com/developers/docs/topics/permissions#role-object)
     *
     * | Permissions needed | Condition |
     * |--------------------|-----------|
     * | MANAGE_ROLES       | always    |
     */
    public async getGuildRoles(guildId: string): Promise<RESTGetAPIGuildRolesResult> {
        return this.requestHandler.request(Routes.guildRoles(guildId), "get", "json");
    }

    /**
     * Create a new Role
     * @param guildId Id of the guild
     * @param data data with role properties
     * @returns [role](https://discord.com/developers/docs/resources/channel#channel-object-channel-structure)
     *
     * | Permissions needed | Condition |
     * |--------------------|-----------|
     * | MANAGE_ROLES       | always    |
     *
     * @example
     * // Create a role with the name "Nice Role" and a color of a soft blue
     * let client = new SnowTransfer('TOKEN')
     * let roleData = {
     *   name: 'Nice Role',
     *   color: 0x7c7cf8
     * }
     * client.guild.createGuildRole('guild Id', roleData)
     */
    public async createGuildRole(guildId: string, data?: RESTPostAPIGuildRoleJSONBody): Promise<RESTPostAPIGuildRoleResult> {
        return this.requestHandler.request(Routes.guildRoles(guildId), "post", "json", data);
    }

    /**
     * Modify the positions of a role or multiple roles
     * @param guildId Id of the guild
     * @param data Role data to update
     * @returns array of [roles](https://discord.com/developers/docs/topics/permissions#role-object)
     *
     * | Permissions needed | Condition |
     * |--------------------|-----------|
     * | MANAGE_ROLES       | always    |
     */
    public async updateGuildRolePositions(guildId: string, data: { id: string; position?: number | null; reason?: string; } | Array<{ id: string; position?: number | null; reason?: string; }>): Promise<RESTPatchAPIGuildRolePositionsResult> {
        return this.requestHandler.request(Routes.guildRoles(guildId), Array.isArray(data) ? "put" : "patch", "json", data);
    }

    /**
     * Update a guild role
     * @param guildId Id of the guild
     * @param roleId Id of the role
     * @param data updated properties of the role
     * @returns [Updated Role](https://discord.com/developers/docs/topics/permissions#role-object)
     *
     * | Permissions needed | Condition |
     * |--------------------|-----------|
     * | MANAGE_ROLES       | always    |
     */
    public async updateGuildRole(guildId: string, roleId: string, data: RESTPatchAPIGuildRoleJSONBody): Promise<RESTPatchAPIGuildRoleResult> {
        return this.requestHandler.request(Routes.guildRole(guildId, roleId), "patch", "json", data);
    }

    /**
     * Delete a role from the guild
     * @param guildId Id of the guild
     * @param roleId Id of the role
     * @returns Resolves the Promise on successful execution
     *
     * | Permissions needed | Condition |
     * |--------------------|-----------|
     * | MANAGE_ROLES       | always    |
     */
    public async removeGuildRole(guildId: string, roleId: string): Promise<void> {
        return this.requestHandler.request(Routes.guildRole(guildId, roleId), "delete", "json");
    }

    /**
     * Get the amount of members that would be pruned when a prune with the passed amount of days would be started
     * @param guildId Id of the guild
     * @param data Object with a days property
     * @returns Object with a "pruned" key indicating the amount of members that would be pruned
     *
     * | Permissions needed | Condition |
     * |--------------------|-----------|
     * | KICK_MEMBERS       | always    |
     */
    public async getGuildPruneCount(guildId: string, data: RESTGetAPIGuildPruneCountQuery): Promise<RESTGetAPIGuildPruneCountResult> {
        return this.requestHandler.request(Routes.guildPrune(guildId), "get", "json", data);
    }

    /**
     * Start a prune
     * @param guildId Id of the guild
     * @param data Object with a days property
     * @returns Object with a "pruned" key indicating the amount of members that were pruned
     *
     * | Permissions needed | Condition |
     * |--------------------|-----------|
     * | KICK_MEMBERS       | always    |
     */
    public async startGuildPrune(guildId: string, data: RESTPostAPIGuildPruneJSONBody): Promise<RESTPostAPIGuildPruneResult> {
        return this.requestHandler.request(Routes.guildPrune(guildId), "post", "json", data);
    }

    /**
     * Get a list of voice regions for the guild, includes vip-regions unlike voice.getVoiceRegions
     * @param guildId Id of the guild
     * @returns List of [voice regions](https://discord.com/developers/docs/resources/voice#voice-region-object)
     */
    public async getGuildVoiceRegions(guildId: string): Promise<RESTGetAPIGuildVoiceRegionsResult> {
        return this.requestHandler.request(Routes.guildVoiceRegions(guildId), "get", "json");
    }

    /**
     * Get invites for a guild
     * @param guildId Id of the guild
     * @returns List of [invites](https://discord.com/developers/docs/resources/invite#invite-object) (with metadata)
     *
     * | Permissions needed | Condition |
     * |--------------------|-----------|
     * | MANAGE_GUILD       | always    |
     */
    public async getGuildInvites(guildId: string): Promise<RESTGetAPIGuildInvitesResult> {
        return this.requestHandler.request(Routes.guildInvites(guildId), "get", "json");
    }

    /**
     * Get integrations for a guild
     * @param guildId Id of the guild
     * @returns List of [integration objects](https://discord.com/developers/docs/resources/guild#integration-object)
     *
     * | Permissions needed | Condition |
     * |--------------------|-----------|
     * | MANAGE_GUILD       | always    |
     */
    public async getGuildIntegrations(guildId: string): Promise<RESTGetAPIGuildIntegrationsResult> {
        return this.requestHandler.request(Routes.guildIntegrations(guildId), "get", "json");
    }

    /**
     * Attach a integration object from the user to the guild
     * @param guildId Id of the guild
     * @param data Integration object with id and type properties
     * @returns Resolves the Promise on successful execution
     *
     * | Permissions needed | Condition |
     * |--------------------|-----------|
     * | MANAGE_GUILD       | always    |
     */
    public async createGuildIntegration(guildId: string, data: { type: string; id: string; }): Promise<void> {
        return this.requestHandler.request(Routes.guildIntegrations(guildId), "post", "json", data);
    }

    /**
     * Update behaviour and settings of an [integration object](https://discord.com/developers/docs/resources/guild#integration-object)
     * @param guildId Id of the guild
     * @param integrationId Id of the integration
     * @returns Resolves the Promise on successful execution
     *
     * | Permissions needed | Condition |
     * |--------------------|-----------|
     * | MANAGE_GUILD       | always    |
     */
    public async updateGuildIntegration(guildId: string, integrationId: string, data: { expire_behavior: number; expire_grace_period: number; enable_emoticons: boolean; }): Promise<void> {
        return this.requestHandler.request(Routes.guildIntegration(guildId, integrationId), "patch", "json", data);
    }

    /**
     * Delete a guild integratiom
     * @param guildId Id of the guild
     * @param integrationId Id of the integration
     * @returns Resolves the Promise on successful execution
     *
     * | Permissions needed | Condition |
     * |--------------------|-----------|
     * | MANAGE_GUILD       | always    |
     */
    public async removeGuildIntegration(guildId: string, integrationId: string): Promise<void> {
        return this.requestHandler.request(Routes.guildIntegration(guildId, integrationId), "delete", "json");
    }

    /**
     * Gets a guild widget object
     * @param guildId Id of the guild
     * @returns [Guild Widget](https://discord.com/developers/docs/resources/guild#guild-widget-object)
     */
    public async getGuildWidget(guildId: string): Promise<RESTGetAPIGuildWidgetJSONResult> {
        return this.requestHandler.request(Routes.guildWidgetJSON(guildId), "get", "json");
    }

    /**
     * Get a guild widget settings object
     * @param guildId Id of the guild
     * @returns [Guild Widget](https://discord.com/developers/docs/resources/guild#guild-widget-object)
     *
     * | Permissions needed | Condition |
     * |--------------------|-----------|
     * | MANAGE_GUILD       | always    |
     */
    public async getGuildWidgetSettings(guildId: string): Promise<RESTGetAPIGuildWidgetSettingsResult> {
        return this.requestHandler.request(Routes.guildWidgetSettings(guildId), "get", "json");
    }

    /**
     * Update a guild widget settings object
     * @param guildId Id of the guild
     * @param data basic data of widget settings
     * @returns [Guild Widget](https://discord.com/developers/docs/resources/guild#guild-widget-object)
     *
     * | Permissions needed | Condition |
     * |--------------------|-----------|
     * | MANAGE_GUILD       | always    |
     */
    public async updateGuildWidgetSettings(guildId: string, data: RESTPatchAPIGuildWidgetSettingsJSONBody): Promise<RESTPatchAPIGuildWidgetSettingsResult> {
        return this.requestHandler.request(Routes.guildWidgetSettings(guildId), "patch", "json", data);
    }

    /**
     * Get a guild's vanity URL code
     * @param guildId Id of the guild
     * @returns partial [invite object](https://discord.com/developers/docs/resources/guild#get-guild-vanity-url-example-partial-invite-object)
     *
     * | Permissions needed | Condition |
     * |--------------------|-----------|
     * | MANAGE_GUILD       | always    |
     */
    public async getGuildVanityURL(guildId: string): Promise<RESTGetAPIGuildVanityUrlResult> {
        return this.requestHandler.request(Routes.guildVanityUrl(guildId), "get", "json");
    }

    /**
     * Get a guild's welcome screen object
     * @param guildId Id of the guild
     * @returns [Guild Welcome Screen](https://discord.com/developers/docs/resources/guild#welcome-screen-object)
     */
    public async getGuildWelcomeScreen(guildId: string): Promise<RESTGetAPIGuildWelcomeScreenResult> {
        return this.requestHandler.request(Routes.guildWelcomeScreen(guildId), "get", "json");
    }

    /**
     * Update a guild welcome screen object
     * @param guildId Id of guild
     * @param data Welcome screen data
     * @returns [Guild Welcome Screen](https://discord.com/developers/docs/resources/guild#welcome-screen-object)
     *
     * | Permissions needed | Condition |
     * |--------------------|-----------|
     * | MANAGE_GUILD       | always    |
     */
    public async editGuildWelcomeScreen(guildId: string, data: RESTPatchAPIGuildWelcomeScreenJSONBody): Promise<APIGuildWelcomeScreen> {
        return this.requestHandler.request(Routes.guildWelcomeScreen(guildId), "patch", "json", data);
    }

    /**
     * Updates the current user's voice state in a stage channel
     * @param guildId Id of the guild
     * @param data Data of the voice state
     * @returns Resolves the Promise on successful execution
     *
     * | Permissions needed | Condition                           |
     * |--------------------|-------------------------------------|
     * | MUTE_MEMBERS       | when trying to un-suppress yourself |
     * | REQUEST_TO_SPEAK   | when trying to request to speak     |
     */
    public updateCurrentUserVoiceState(guildId: string, data: RESTPatchAPIGuildVoiceStateCurrentMemberJSONBody): Promise<void> {
        return this.requestHandler.request(Routes.guildVoiceState(guildId, "@me"), "patch", "json", data);
    }

    /**
     * Updates a user's voice state in a stage channel
     * @param guildId Id of the guild
     * @param data Data of the voice state
     * @returns Resolves the Promise on successful execution
     *
     * | Permissions needed | Condition                           |
     * |--------------------|-------------------------------------|
     * | MUTE_MEMBERS       | when trying to suppress/un-suppress |
     */
    public updateUserVoiceState(guildId: string, userId: string, data: RESTPatchAPIGuildVoiceStateUserJSONBody): Promise<void> {
        return this.requestHandler.request(Routes.guildVoiceState(guildId, userId), "patch", "json", data);
    }
}

export = GuildMethods;

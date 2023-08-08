import { clientConfig } from "../components/clientConfig.js";
import platformClient from "purecloud-platform-client-v2/dist/node/purecloud-platform-client-v2.js";

const client = platformClient.ApiClient.instance;
const { clientId, redirectUri } = clientConfig;
const campaignData: any = {};

const outboundApi = new platformClient.OutboundApi();
const analyticsApi = new platformClient.ConversationsApi();
const responseManagementApi = new platformClient.ResponseManagementApi();

const cache: any = {};

export function authenticate() {
  return client
    .loginImplicitGrant(clientId, redirectUri, { state: "state" })
    .then((data: any) => {
      return data;
    })
    .catch((err: any) => {
      console.error(err);
    });
}

export function getCampaign() {
  let opts = {
    pageSize: 50,
    pageNumber: 1,
    allowEmptyResult: false,
    filterType: "Prefix",
    sortOrder: "ascending",
  };

  return new Promise((resolve, reject) => {
    outboundApi
      .getOutboundMessagingcampaigns(opts)
      .then((campaignData: any) => {
        console.log(
          `getOutboundSequences success! data: ${JSON.stringify(
            campaignData,
            null,
            2
          )}`
        );
        resolve(campaignData);
      })
      .catch((err: any) => {
        console.log("There was a failure calling getOutboundSequences");
        console.error(err);
        reject(err);
      });
  });
}
export function postCampaignDetails(campaignId: string, body: object) {
  console.log("postCampaignDetails", body);

  return new Promise((resolve, reject) => {
    outboundApi
      .putOutboundMessagingcampaign(campaignId, body)
      .then((postCampaignData: any) => {
        console.log(
          `putOutboundMessagingcampaign success! data: ${JSON.stringify(
            postCampaignData,
            null,
            2
          )}`
        );
        resolve(postCampaignData);
      })
      .catch((err: any) => {
        console.log(
          "There was a failure calling putOutboundMessagingcampaign",
          body
        );
        console.error(err);
        reject(err);
      });
  });
}

export function getStatus(dates: string, outboundCampaignId: string) {
  console.log("getStatus", dates, outboundCampaignId);
  // let body = {
  //   interval: dates,
  //   tableConfigurations: [
  //     {
  //       name: "MEDIA_TYPE_FILTER",
  //       filter: {
  //         mediaTypes: ["email"],
  //         outboundCampaignIds: [outboundCampaignId],
  //       },
  //     },
  //   ],
  // };

  let body = {
    segmentFilters: [
      {
        type: "or",
        predicates: [
          {
            dimension: "mediaType",
            value: "email",
          },
        ],
      },
      {
        type: "or",
        predicates: [
          {
            dimension: "direction",
            value: "outbound",
          },
        ],
      },
      {
        type: "or",
        predicates: [
          {
            type: "dimension",
            dimension: "deliveryStatus",
            value: "DeliveryFailed",
          },
          {
            type: "dimension",
            dimension: "deliveryStatus",
            value: "DeliverySuccess",
          },
          {
            type: "dimension",
            dimension: "deliveryStatus",
            value: "Read",
          },
          {
            type: "dimension",
            dimension: "deliveryStatus",
            value: "Received",
          },
          {
            type: "dimension",
            dimension: "deliveryStatus",
            value: "Sent",
          },
        ],
      },
      {
        type: "or",
        predicates: [
          {
            dimension: "outboundCampaignId",
            value: outboundCampaignId,
          },
        ],
      },
    ],
    conversationFilters: [
      {
        type: "or",
        predicates: [
          {
            dimension: "originatingDirection",
            value: "outbound",
          },
        ],
      },
    ],
    interval: dates,
  };

  console.log(body);

  return new Promise((resolve, reject) => {
    analyticsApi
      .postAnalyticsConversationsDetailsQuery(body)
      .then((statusData: any) => {
        console.log(
          `postAnalyticsConversationsDetailsQuery success! : ${JSON.stringify(
            statusData,
            null,
            2
          )}`
        );
        resolve(statusData);
      })
      .catch((err: any) => {
        console.log(
          "There was a failure calling postAnalyticsConversationsDetailsQuery"
        );
        console.error(err);
      });
  });
}

export function postResponsemanagementResponses(
  subject: string,
  emailBody: string
) {
  let body = {
    name: "Personalized Email Response",
    libraries: [
      {
        id: "f259917c-1938-4bb8-9dd0-33c97ce883ab",
        name: "Outbound Email Campaign",
      },
    ],
    texts: [
      {
        content: `<div style=\"font-size: 12pt; font-family: helvetica, arial;\"><p>${emailBody}</p></div>`,
        contentType: "text/html",
        type: "body",
      },
      {
        content: subject,
        contentType: "text/plain",
        type: "subject",
      },
    ],
  };
  console.log("postResponsemanagementResponses BODY:", body);
  return new Promise((resolve, reject) => {
    responseManagementApi
      .postResponsemanagementResponses(body)
      .then((postResponseManagementData: any) => {
        console.log(
          `postResponsemanagementResponses success! data: ${JSON.stringify(
            postResponseManagementData,
            null,
            2
          )}`
        );
        resolve(postResponseManagementData);
      })
      .catch((err: any) => {
        console.log(
          "There was a failure calling postResponsemanagementResponses"
        );
        console.error(err);
      });
  });
}

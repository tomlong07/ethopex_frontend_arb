<script setup lang="ts"></script>
<template>
  <n-grid y-gap="12" cols="1">
    <n-gi class="flex flex-col gap-4">
      <n-card title="Add Campaign Rule Settings" class="card-flex-gap-4">
        <AddCampaignDataSource />
        <AddCampaignOriginCampaigns />
        <AddCampaignConsiderDataFrom />
        <AddCampaignBidding />
        <AddCampaignConditions />

        <AddCampaignCampaignType />
        <AddCampaignGoals />
        <AddCampaignLabel />
        <AddCampaignSearchToSearch />
        <AddCampaignGoogleAccount />
        <AddCampaignLandingPage />
        <AddCampaignBiddingType />
        <AddCampaignBudget />
        <AddCampaignLocation />
        <AddCampaignLanguage />
        <AddCampaignCreative />
      </n-card>
    </n-gi>
    <n-gi class="flex flex-col gap-4">
      <AddCampaignNetworks />
    </n-gi>
  </n-grid>
</template>

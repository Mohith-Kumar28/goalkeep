import type { ServicePageContent, ServiceSlug } from "../service-page"
import { content as dashboardsAndReporting } from "./dashboards-and-reporting"
import { content as dataAdoptionAndCapacityBuilding } from "./data-adoption-and-capacity-building"
import { content as dataSystemsAndWorkflows } from "./data-systems-and-workflows"
import { content as impactAndMeasurementStrategy } from "./impact-and-measurement-strategy"

export const servicePages: Record<ServiceSlug, ServicePageContent> = {
  "impact-and-measurement-strategy": impactAndMeasurementStrategy,
  "data-systems-and-workflows": dataSystemsAndWorkflows,
  "dashboards-and-reporting": dashboardsAndReporting,
  "data-adoption-and-capacity-building": dataAdoptionAndCapacityBuilding,
}

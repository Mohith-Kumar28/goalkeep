import type { ServicePageContent, ServiceSlug } from '../service-page'
import { content as impactAndMeasurementStrategy } from './impact-and-measurement-strategy'

export const servicePages: Partial<Record<ServiceSlug, ServicePageContent>> = {
  'impact-and-measurement-strategy': impactAndMeasurementStrategy,
}

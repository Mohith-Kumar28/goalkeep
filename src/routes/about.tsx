import { createFileRoute } from "@tanstack/react-router"
import { AboutPage } from "@/components/design/about/page"

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About us | Goalkeep" },
      {
        name: "description",
        content:
          "Who we are, how we work, and the team behind Goalkeep. Practitioners, not vendors.",
      },
    ],
  }),
  component: AboutPage,
})

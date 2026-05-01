import { WeekDetailView } from "@/components/timesheets/week-detail-view"

export default async function WeekPage(props: {
  params: Promise<{ weekId: string }>
}) {
  const { weekId } = await props.params
  return <WeekDetailView weekId={weekId} />
}

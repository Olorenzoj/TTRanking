 import RankingWrapper from '@/components/dashboard/RankingWrapper'
 import AscensosDescensosWrapper from "@/components/dashboard/AscensosDescensosWrapper";

export default function RankingPage() {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-4">
        <h1 className="text-2xl font-bold text-gray-800">Ranking</h1>
        <p className="text-gray-600">visualiza el ranking</p>
      </div>
      <AscensosDescensosWrapper/>
      <RankingWrapper/>
    </div>
  )
}
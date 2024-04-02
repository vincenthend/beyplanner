import { PartData, PartType } from 'src/types'
import { Descriptions, Progress, Space, Typography } from 'antd'
import PartsLabelTag from 'src/components/PartsLabelTag'
import React from 'react'

interface Props {
  components: Partial<Record<PartType, PartData>>
}

interface ProgressStatsProps {
  dataKey: string
  label: string
  components: Partial<Record<PartType, PartData>>
}

function ProgressStats(props: ProgressStatsProps) {
  const { dataKey, label, components } = props
  const value = Object.values(components).reduce((acc, curr) => acc + (curr?.[dataKey] ?? 0), 0)
  return (
    <div>
      <div>{label}</div>
      <Progress percent={value} showInfo={true} format={(percent) => percent} />
    </div>
  )
}

function PartSetDisplay(props: { part: PartData }) {
  const { part } = props
  return (
    <Space>
      {part.wiki ? (
        <Typography.Link target={'_blank'} href={part.wiki.url}>
          {part.name}
        </Typography.Link>
      ) : (
        part.name
      )}
      <PartsLabelTag value={part.type} />
      {part.wiki && (
        <Typography.Link target={'_blank'} href={part.wiki.set_url}>
          ({part.wiki.set_id})
        </Typography.Link>
      )}
    </Space>
  )
}

function StatsDisplay(props: Props) {
  const { components } = props

  return (
    <div>
      <div>
        <Typography.Title level={5}>Components:</Typography.Title>
        <Descriptions
          column={1}
          items={Object.entries(components).map(([type, part]) => ({
            label: type,
            key: type,
            children: <PartSetDisplay part={part} />,
          }))}
        />
      </div>
      <div>
        <Typography.Title level={5}>Stats:</Typography.Title>
        <ProgressStats dataKey={'attack'} label={'Attack'} components={components} />
        <ProgressStats dataKey={'defense'} label={'Defense'} components={components} />
        <ProgressStats dataKey={'endurance'} label={'Endurance'} components={components} />
        <ProgressStats dataKey={'dash'} label={'Dash'} components={components} />
        <ProgressStats dataKey={'burst_resistance'} label={'Burst Res'} components={components} />
      </div>
    </div>
  )
}

export default StatsDisplay

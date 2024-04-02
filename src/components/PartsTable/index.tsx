import { Popover, Table, TableProps, Tabs, Typography } from 'antd'
import { val } from 'cheerio/lib/api/attributes'
import Image from 'next/image'
import React from 'react'
import PartsLabelTag from 'src/components/PartsLabelTag'
import { PartData, PartType } from 'src/types'

interface Props {
  data?: Record<PartType, PartData[]>
  onSelect: (part: Partial<Record<PartType, PartData>>) => void
}

function PartsPopover(props: { data: PartData }) {
  const { data } = props
  return (
    <div>
      <Image src={data.image} alt={data.id} width={300} height={300} />
    </div>
  )
}

const numberSorter = (key: string) => (a: Record<string, any>, b: Record<string, any>) =>
  a[key] - b[key]
const stringSorter = (key: string) => (a: Record<string, any>, b: Record<string, any>) =>
  a[key].localeCompare(b[key])

const partsColumns: Record<PartType, TableProps['columns']> = {
  [PartType.BIT]: [
    {
      dataIndex: 'endurance',
      title: 'En',
      width: 75,
      sorter: numberSorter('endurance'),
    },
    {
      dataIndex: 'dash',
      title: 'Dash',
      width: 75,
      sorter: numberSorter('dash'),
    },
    {
      dataIndex: 'burst_resistance',
      title: 'Burst Res',
      width: 75,
      sorter: numberSorter('burst_resistance'),
    },
  ],
  [PartType.RATCHET]: [
    {
      dataIndex: 'endurance',
      title: 'En',
      width: 75,
      sorter: numberSorter('endurance'),
    },
  ],
  [PartType.BLADE]: [],
}

function PartsTable(props: Props) {
  const { data, onSelect } = props
  const [selectedType, setSelectedType] = React.useState<PartType>(PartType.BLADE)
  const [selectedParts, setSelectedParts] = React.useState<Partial<Record<PartType, PartData>>>({})

  const handlePartSelect = React.useCallback(
    (part: PartData) => {
      setSelectedParts((selectedParts) => ({
        ...selectedParts,
        [selectedType]: part,
      }))
    },
    [selectedType],
  )

  React.useEffect(() => {
    onSelect(selectedParts)
  }, [selectedParts])

  const columns: TableProps['columns'] = [
    {
      dataIndex: 'name',
      title: 'Name',
      render: (data, partData) => {
        return (
          <Popover content={<PartsPopover data={partData} />}>
            {partData.wiki ? (
              <Typography.Link href={partData.wiki.url} target={'_blank'}>
                {data}
              </Typography.Link>
            ) : (
              data
            )}
          </Popover>
        )
      },
    },
    {
      dataIndex: 'type',
      title: 'Type',
      width: 150,
      render: (value) => <PartsLabelTag value={value} />,
      sorter: stringSorter('type'),
    },
    {
      dataIndex: 'weight',
      title: 'Weight',
      width: 75,
      sorter: numberSorter('weight'),
    },
    {
      dataIndex: 'height',
      title: 'Height',
      width: 75,
      sorter: numberSorter('height'),
    },
    {
      dataIndex: 'attack',
      title: 'Atk',
      width: 75,
      sorter: numberSorter('attack'),
    },
    {
      dataIndex: 'defense',
      title: 'Def',
      width: 75,
      sorter: numberSorter('defense'),
    },
    ...partsColumns[selectedType],
  ]

  return (
    <>
      <Tabs
        items={[
          { label: 'Blade', key: PartType.BLADE },
          { label: 'Ratchet', key: PartType.RATCHET },
          {
            label: 'Bit',
            key: PartType.BIT,
          },
        ]}
        onChange={(key: string) => setSelectedType(key as PartType)}
      />
      <Table
        scroll={{ y: 400 }}
        dataSource={data?.[selectedType]}
        columns={columns}
        size={'small'}
        pagination={false}
        rowKey={'id'}
        rowSelection={{
          type: 'radio',
          onSelect: handlePartSelect,
          selectedRowKeys: selectedParts[selectedType] ? [selectedParts[selectedType]!.id] : [],
        }}
      />
    </>
  )
}

export default PartsTable

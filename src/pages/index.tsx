import { useRequest } from 'ahooks'
import { Card, Col, Row, Table, Typography } from 'antd'
import Head from 'next/head'
import React, { useState } from 'react'
import PartsTable from 'src/components/PartsTable'
import { PartData, PartType } from 'src/types'
import StatsDisplay from 'src/components/StatsDisplay'

async function getParts(): Promise<Record<PartType, PartData[]>> {
  const resp = await window.fetch('/api/data')
  return resp.json()
}

export default function Home() {
  const { data, loading } = useRequest(getParts)
  const [selectedComponents, setSelectedComponents] = React.useState<
    Partial<Record<PartType, PartData>>
  >({})
  return (
    <div>
      <Head>
        <title>Bey Planner 2.0</title>
        <meta name="description" content="Beyblade planner with better UX" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div
        style={{
          width: '100vw',
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Card style={{ width: '90%', maxHeight: '80%' }}>
          <Row style={{ width: '100%' }} gutter={16}>
            <Col span={18}>
              <PartsTable data={data} onSelect={setSelectedComponents} />
            </Col>
            <Col span={6}>
              <StatsDisplay components={selectedComponents} />
            </Col>
          </Row>
        </Card>
      </div>
    </div>
  )
}

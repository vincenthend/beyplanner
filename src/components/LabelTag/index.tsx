import { Tag, TagProps } from 'antd'
import React from 'react'

interface TagConfig {
  label: React.ReactNode
  color?: TagProps['color']
}

interface Props<T> extends TagProps {
  value: T
}

export function createLabelTag<T extends string | number | symbol>(
  config: Record<T, TagConfig | string>,
) {
  return function PartsTag(props: Props<T>) {
    const { value, ...tagProps } = props

    const tagConfig: TagConfig =
      typeof config[value] === 'string'
        ? { label: config[value] as string }
        : (config[value] as TagConfig)

    return (
      <Tag color={tagConfig.color} {...tagProps}>
        {tagConfig.label}
      </Tag>
    )
  }
}

// 生成树
export const buildTree = (list) => {
  // 根据id构建映射
  const map = list.reduce((memo, current) => {
    memo[current.id] = { ...current }
    return memo
  }, {})

  // 顶层目录
  const tree = []

  // 遍历每一项
  list.forEach((item) => {
    // 获取父项
    const pid = item.parentId

    // 找到映射的元素
    const current = map[item.id]

    // 判断父项是否存在
    if (pid !== 0 || pid !== null) {
      const parent = map[pid]
      if (parent) {
        const children = parent?.children || []
        children.push(current)
        parent.children = children
        return
      }
    }

    // 放置顶层
    tree.push(current)
  })

  // 打印
  console.log(tree)

  return tree
}

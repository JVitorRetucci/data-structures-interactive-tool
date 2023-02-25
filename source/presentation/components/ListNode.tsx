import { Handle, NodeProps, Position } from "reactflow";

export interface ListNodeProps {
  value: number;
  nextNodeId: number;
  prevNodeId?: number;
}

export const ListNode = ({id, data: {value, nextNodeId, prevNodeId}}: NodeProps<ListNodeProps>): JSX.Element => {
  
  return (
    <>
      <Handle type="target" position={Position.Left} />
      <div className="flex flex-col justify-center w-fit border-black border rounded bg-white">
        <span className="text-center p-1 text-xs border-b border-black">{ id }</span>
        <div className="flex justify-center w-fit">
          {!!prevNodeId && <p className="p-4 border-r border-black"> {prevNodeId} </p>}
          <p className="p-4 border-r border-black">{ value }</p>
          <p className="p-4">{ nextNodeId }</p>
        </div>
      </div>
      <Handle type="source" position={Position.Right} />
    </>
  )
}
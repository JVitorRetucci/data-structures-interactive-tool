import classNames from "classnames";
import { Handle, NodeProps, Position } from "reactflow";

export interface ListNodeProps {
  value: number;
  nextNodeId: number;
  isActive?: boolean;
}

export const ListNode = ({id, data: {value, nextNodeId, isActive = false }}: NodeProps<ListNodeProps>): JSX.Element => {
  return (
    <>
      <Handle type="target" position={Position.Left} isConnectable={false} />
      <div className={classNames("flex flex-col justify-center w-fit border-black border rounded bg-white", isActive ? 'ring-4 ring-blue-700' : '')}>
        <span className="text-center p-1 text-xs border-b border-black">Id: { id }</span>
        <div className="flex justify-center w-fit">
          <p className="py-4 px-2 border-r border-black flex flex-col">
            Value:
            <strong>{ value }</strong>
          </p>
          <p className="py-4 px-2 flex flex-col">
            Next:
            <strong>{ nextNodeId }</strong>
          </p>
        </div>
      </div>
      <Handle type="source" position={Position.Right} isConnectable={false} />
    </>
  )
}
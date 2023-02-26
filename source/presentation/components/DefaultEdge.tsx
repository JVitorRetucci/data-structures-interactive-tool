import { getSmoothStepPath, MarkerType, SmoothStepEdgeProps } from 'reactflow';

export const DefaultEdge = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {
    strokeWidth: 2
  },
  markerEnd = MarkerType.ArrowClosed,
}: SmoothStepEdgeProps ): JSX.Element => {
  const [edgePath] = getSmoothStepPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  return (
    <>
      <path
        id={id}
        style={style}
        className="react-flow__edge-path"
        d={edgePath}
        markerEnd={markerEnd}
      />
    </>
  );
}

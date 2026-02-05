import React, { useEffect, useContext, useState } from "react";
import { Slider } from "@blueprintjs/core";
import { VolumeContext } from "../../providers/VolumeProvider";

const VolumeControl: React.FC = () => {
  const { volume, setVolume } = useContext(VolumeContext);
  const [localVolume, setLocalVolume] = useState(volume); // 負荷対策

  useEffect(() => {
    // SSRとCSRで2回更新される
    setLocalVolume(volume);
  }, [volume]);

  return (
    <Slider
      labelRenderer={false}
      max={100}
      value={localVolume}
      onChange={(num) => setLocalVolume(num)}
      onRelease={(num) => setVolume(num)}
    />
  );
};

export default VolumeControl;

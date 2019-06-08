import React from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';


function CircularDeterminate() {
    const [progress, setProgress] = React.useState(0);

    React.useEffect(() => {
        function tick() {
            // reset when reaching 100%
            setProgress(oldProgress => (oldProgress >= 100 ? 0 : oldProgress + 1));
        }

        const timer = setInterval(tick, 20);
        return () => {
            clearInterval(timer);
        };
    }, []);

    return (
        <div>
            <CircularProgress variant="determinate" value={progress} />
        </div>
    );

}
export default CircularDeterminate;

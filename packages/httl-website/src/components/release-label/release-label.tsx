import releases from '../../../../../releases.json';

interface ReleaseLabelProps {
  className?: string;
}


export function ReleaseLabel(props: ReleaseLabelProps) {
  const { className } = props;
  return (
    <div className={className ?? "hidden sm:mb-8 sm:flex sm:justify-center"}>
      <a href={`/docs/release-notes#${releases[0].date}`} className="relative rounded-full px-3 py-1 text-sm/6 text-gray-400 ring-1 ring-gray-200/10">
        <span className="text-gray-500">Release</span> #{releases[0].date}
      </a>
    </div>
  );
}

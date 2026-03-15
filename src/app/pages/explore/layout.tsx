import { ExploreVoteProviderWrapper } from './explore-vote-provider-wrapper';

export default function ExploreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ExploreVoteProviderWrapper>
      {children}
    </ExploreVoteProviderWrapper>
  );
}

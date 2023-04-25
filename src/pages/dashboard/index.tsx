import { useGetUserProfile } from '@/modules/common/services';

const Dashboard = () => {
  const { data: userProfile } = useGetUserProfile();
  return <>DashboardPage</>;
};

export default Dashboard;

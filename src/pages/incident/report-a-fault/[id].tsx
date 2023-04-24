import { useRouter } from 'next/router';

const DetailReportAFault = () => {
  const router = useRouter();
  const { id } = router.query;
  const { back } = router;

  return (
    <>
      <>DetailReportAFault has ID: {id || ''}</>
      <br />
      <button onClick={back}>Back</button>
    </>
  );
};

export default DetailReportAFault;

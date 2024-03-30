import {Link} from 'react-router-dom';


function SidebarHome() {
    return (
    <div className='bg-black w-[200px] h-screen relative'>
      <div className='flex flex-col mt-8 text-lg'>
        <Link className='text-white ml-5 py-1 underline cursor-pointer' to='/active'>Active Exams</Link>
        <Link className='text-white ml-5 py-1 underline cursor-pointer' to='/expired'>Expired Exams</Link>
      </div>
    </div>
    );
};

export default SidebarHome;
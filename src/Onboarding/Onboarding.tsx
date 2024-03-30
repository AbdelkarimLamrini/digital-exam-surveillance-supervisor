import React from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import ExamTable from './ExamTable';
import {useGetAllExams} from '../Hooks/useExam';
import moment from 'moment';
import SidebarHome from './SidebarHome';


function Onboarding() {
    const navigate = useNavigate();
    const {data: exams, isLoadingGettingAllExams} = useGetAllExams();

    const {type} = useParams();


    const formatDateTime = (dateTime: string) => {
        // Formats to a localized string
        return moment(dateTime).format('LLL');
    };

    const handleViewExam = (examId: any) => {
        navigate(`/supervise/${examId}`);
    };

    const rows = exams?.map((exam: {
        startTime: string;
        endTime: string;
        creationTime: string;
    }) => {
        const currentTime = new Date();
        const endTime = new Date(exam.endTime);
        const expired = endTime < currentTime;
        console.log(endTime);

        return {
            ...exam,
            creationTime: formatDateTime(exam.creationTime),
            startTime: formatDateTime(exam.startTime),
            endTime: formatDateTime(exam.endTime),
            expired: expired,
        };
    }).filter((exam: any) => type === "active" ? !exam.expired : exam.expired) || [];


    return (
        <div className='flex flex-row'>
            <SidebarHome/>
            <div className='flex flex-col p-3 my-2 mx-auto'>
                <h2 className='text-2xl font-bold pb-5'>{type === "active" ? 'Active Exams' : 'Expired Exams'}</h2>
                <div className='my-2'>
                    <button className='bg-black text-white rounded-lg py-2 px-3'
                            onClick={() => navigate('/create-exam')}>Create Exam
                    </button>
                </div>
                {isLoadingGettingAllExams ? <div>Loading...</div> : <ExamTable rows={rows}/>}
            </div>
        </div>

    );
}

export default Onboarding;

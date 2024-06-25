import loading from './loading.gif'

const Spinner = () => {
    return (
        <div className='text-center' style={{ margin: '15px' }}>
            <img src={loading} alt="loading" style={{ height: '70px' }} />
        </div>
    )
}

export default Spinner

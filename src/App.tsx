import { useState } from 'react'
import Layout from './components/Layout'
import Employees from './components/Employees'
import Shifts from './components/Shifts'

function App() {
  const [activeTab, setActiveTab] = useState<'empleados' | 'turnos'>(
    'empleados',
  )

  return (
    <Layout activeTab={activeTab} onTabChange={setActiveTab}>
      {activeTab === 'empleados' ? <Employees /> : <Shifts />}
    </Layout>
  )
}

export default App

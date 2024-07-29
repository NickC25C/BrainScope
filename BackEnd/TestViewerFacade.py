import unittest
from unittest.mock import MagicMock, patch
from ViewerFacade import ViewerFacade

class TestViewerFacade(unittest.TestCase):

    @patch('petitions.ModuleRawData')
    @patch('petitions.ModuleProcessData')
    def setUp(self, MockModuleProcessData, MockModuleRawData):
        self.mock_raw_data = MockModuleRawData.return_value
        self.mock_process_data = MockModuleProcessData.return_value
        self.viewer_facade = ViewerFacade()
    
    def tearDown(self):
        ViewerFacade._instance = None

    def test_transform_data(self):
        # Configura el comportamiento de los mocks
        self.mock_raw_data.load_and_configure_data.return_value = 'raw_data'
        self.mock_raw_data.filter_signal.return_value = 'filtered_data'
        self.mock_raw_data.configure_and_fit_ica.return_value = 'ica'
        self.mock_raw_data.find_and_exclude_artifacts.return_value = 'ica_cleaned'
        self.mock_raw_data.apply_ica.return_value = 'cleaned_data'
        self.mock_raw_data.save_cleaned_data.return_value = 'saved_data'

        inputfile = 'input_file'
        result = self.viewer_facade.transformData(inputfile)

        self.mock_raw_data.load_and_configure_data.assert_called_once_with(inputfile)
        self.mock_raw_data.filter_signal.assert_called_once_with('raw_data')
        self.mock_raw_data.configure_and_fit_ica.assert_called_once_with('filtered_data')
        self.mock_raw_data.find_and_exclude_artifacts.assert_called_once_with('ica', 'filtered_data')
        self.mock_raw_data.apply_ica.assert_called_once_with('ica_cleaned', 'filtered_data')
        self.mock_raw_data.save_cleaned_data.assert_called_once_with('cleaned_data')

        self.assertEqual(result, 'saved_data')

    def test_get_engagement_file(self):
        self.mock_process_data.split_Engagement_csv.return_value = 'engagement_file'
        inputfile = 'input_file'
        result = self.viewer_facade.getEngagementFile(inputfile)
        self.mock_process_data.split_Engagement_csv.assert_called_once_with(inputfile)
        self.assertEqual(result, 'engagement_file')

    def test_get_memorization_file(self):
        self.mock_process_data.split_Memorization_csv.return_value = 'memorization_file'
        inputfile = 'input_file'
        result = self.viewer_facade.getMemorizationFile(inputfile)
        self.mock_process_data.split_Memorization_csv.assert_called_once_with(inputfile)
        self.assertEqual(result, 'memorization_file')

    def test_get_workload_file(self):
        self.mock_process_data.split_Workload_csv.return_value = 'workload_file'
        inputfile = 'input_file'
        result = self.viewer_facade.getWorkloadFile(inputfile)
        self.mock_process_data.split_Workload_csv.assert_called_once_with(inputfile)
        self.assertEqual(result, 'workload_file')

if __name__ == '__main__':
    unittest.main()
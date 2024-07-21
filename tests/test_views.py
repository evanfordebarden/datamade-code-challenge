import pytest


def test_api_parse_succeeds(client):

    address_string = '123 main st chicago il'

    # make an api call with the given address_string
    response = client.get('/api/parse/', {'input_string': address_string})

    # test response for appropriate status code, data keys, and types of data
    # returned in those keys
    try:
        assert response.status_code == 200
        assert 'input_string' in response.data
        assert 'address_components' in response.data
        assert 'address_type' in response.data
        assert isinstance(response.data['input_string'], str)
        assert isinstance(response.data['address_components'], dict)
        assert isinstance(response.data['address_type'], str)
    except AssertionError as e:
        pytest.fail(f"Test failed: {e}")


def test_api_parse_raises_error(client):

    address_string = '123 main st chicago il 123 main st'
    # make an api call with the given address_string
    response = client.get('/api/parse/', {'input_string': address_string})

    # test response for appropriate (failed) status code, data key, and
    # error message within detail.
    try:
        assert response.status_code == 400  # Bad Request
        assert 'detail' in response.data
        assert 'Error parsing address' in response.data['detail']
    except AssertionError as e:
        pytest.fail(f"Test failed: {e}")

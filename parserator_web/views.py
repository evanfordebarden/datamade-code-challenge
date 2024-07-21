import usaddress
from django.views.generic import TemplateView
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.renderers import JSONRenderer
from rest_framework.exceptions import ParseError


class Home(TemplateView):
    template_name = 'parserator_web/index.html'


class AddressParse(APIView):
    renderer_classes = [JSONRenderer]

    def get(self, request):
        # extract the input_string from the request
        input_string = request.query_params.get('input_string')
        # if there is no input_string, raise an error
        if not input_string:
            raise ParseError("No input provided.")
        # attempt to parse the input_string
        address_components, address_type = self.parse(input_string)
        # return the desired response
        return Response({
            'input_string': input_string,
            'address_components': address_components,
            'address_type': address_type
            })

    def parse(self, address):
        # use usaddress to parse with address
        try:
            address_components, address_type = usaddress.tag(address)
            # if unable to, raise an error
        except usaddress.RepeatedLabelError as e:
            raise ParseError(f"Error parsing address: {str(e)}")
        # return the parsed items
        return address_components, address_type
